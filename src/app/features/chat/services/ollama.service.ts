import {inject, Injectable, signal} from '@angular/core';
import {AiModelDto} from '../models/ai-model.model';
import {OllamaApiService} from './ollama-api.service';
import {Message, ReqMessage, SystemMessage} from '../models/message.model';
import {Subscription} from 'rxjs';
import {OllamaLocalStorageService} from './ollama-local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class OllamaService {
  private availableModels = signal<AiModelDto[]>([]);
  private selectedModel = signal<AiModelDto | null>(null);
  private messageHistory = signal<Message[]>([]);
  private currentResponse = signal<string>('');
  private chatSubscription: Subscription | null = null;
  private loadingResponse = signal<boolean>(false);
  private systemPrompts = signal<SystemMessage[]>([]);

  ollamaApiService = inject(OllamaApiService);
  localStorageService = inject(OllamaLocalStorageService);

  loadModels() {
    return this.ollamaApiService.getModels().subscribe((response) => {
      this.availableModels.set(response.models);
      if (response.models.length > 0) {
        this.selectedModel.set(response.models[0]);
        console.warn('Current model set to', response.models[0]);
      } else {
        console.warn('OllamaService: No AI models found');
      }
    });
  }

  loadSystemPrompts() {
    const prompts = this.localStorageService.getAllMessages();
    this.systemPrompts.set(prompts);
    console.log('OllamaService: Loaded system prompts', prompts);
  }

  saveSystemPrompts(prompts: SystemMessage[]) {
    this.localStorageService.saveAllMessages(prompts);
    console.log('OllamaService: Saved system prompts', this.systemPrompts());
  }

  clearSystemPrompts() {
    this.localStorageService.clearAllMessages();
    this.systemPrompts.set([]);
    console.log('OllamaService: Cleared all system prompts');
  }

  get aiModels() {
    return this.availableModels;
  }

  get currentModel() {
    return this.selectedModel;
  }

  get messageHistoryList() {
    return this.messageHistory;
  }

  get partialResponse() {
    return this.currentResponse;
  }

  get isLoadingResponse() {
    return this.loadingResponse;
  }

  get systemPromptsSignal() {
    return this.systemPrompts;
  }

  setCurrentModel(model: AiModelDto | null) {
    console.log('OllamaService: Chose model', model);
    this.selectedModel.set(model);
  }

  regenerateResponse(ref_id: string) {
    let message = this.messageHistory().find(m => m.req_id === ref_id);
    if (message) {
      this.sendChatMessage(message.content);
    }
  }

  sendChatMessage(userInput: string) {
    const req_id = crypto.randomUUID();
    this.loadingResponse.set(true);
    let responseMessage = '';
    // Add user message to history
    this.messageHistory.set([...this.messageHistory(), {role: 'user', content: userInput, req_id: req_id}]);
    let messages: ReqMessage[] = [];
    messages.push(
      ...this.systemPrompts()
        .filter((sp: SystemMessage) => sp.active)
        .map((sp: SystemMessage) => ({ role: sp.role, content: sp.content }))
    );
    // Add all previous messages
    messages.push(...this.messageHistory());
    const modelName = this.selectedModel()?.name ?? '';
    this.chatSubscription = this.ollamaApiService.sendChatMessage(modelName, messages).subscribe({
      next: (event) => {
        if (event.type === 3) {
          const jsonResponse = this.processStreamResponse(event.partialText);
          responseMessage = jsonResponse;
          this.currentResponse.set(responseMessage);
          console.log('OllamaService: Received response', jsonResponse);
        }
        if (event.type === 4) {
          console.log('OllamaService: Response completed 4', event);
          this.messageHistory.set([...this.messageHistory(), {
            role: 'assistant',
            content: this.currentResponse(),
            total_duration: this.getTotalDuration(event.body),
            ref_id: req_id
          }]);
          this.currentResponse.set('');
          this.loadingResponse.set(false);
        }
      },
      error: (error) => {
        this.loadingResponse.set(false);
        console.error('Error sending chat message:', error);
      }
    });
  }

  processStreamResponse(chunk: string) {
    console.log('OllamaService: Processing stream response', chunk);
    const substrings = chunk.split('\n');
    const jsonObjects = substrings.map((substr) => {
      if (substr !== '') {
        const chunk = JSON.parse(substr);
        return chunk.message.content;
      }
    });

    return jsonObjects.join('');
  }

  getTotalDuration(responseBody: string): number {
    const lines = responseBody.split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      try {
        const obj = JSON.parse(lines[i]);
        if ('total_duration' in obj) {
          return obj.total_duration;
        }
      } catch {
        // Ignore parse errors
      }
    }
    return -1;
  }

  abortChatMessage() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
      this.chatSubscription = null;
      this.loadingResponse.set(false);
      console.log('OllamaService: Chat message stream aborted');
    }
  }

  newChat() {
    this.abortChatMessage();
    this.messageHistory.set([]);
    this.currentResponse.set('');
  }
}
