import { inject, Injectable, signal } from '@angular/core';
import { AiModelDto } from '../models/ai-model.model';
import { OllamaApiService } from './ollama-api.service';
import { ReqMessage } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class OllamaService {
  private availableModels = signal<AiModelDto[]>([]);
  private selectedModel = signal<AiModelDto | null>(null);
  private messageHistory = signal<ReqMessage[]>([]);
  private currentResponse = signal<string>('');
  private activeSystemPrompt = signal<string>('');

  ollamaApiService = inject(OllamaApiService);

  loadModels() {
    return this.ollamaApiService.getModels().subscribe((response) => {
      this.availableModels.set(response.models)
      if (response.models.length > 0) {
        this.selectedModel.set(response.models[0]);
        console.warn('Current model set to', response.models[0]);
      } else {
        console.warn('OllamaService: No AI models found');
      }
    })
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

  setCurrentModel(model: AiModelDto | null) {
    console.log('OllamaService: Chose model', model);
    this.selectedModel.set(model);
  }

  sendChatMessage(userInput: string) {
    let responseMessage = '';
    // Add user message to history
    this.messageHistory.set([...this.messageHistory(), { role: 'user', content: userInput }]);
    let messages: ReqMessage[] = [];
    // Add system prompt if present
    if (this.activeSystemPrompt()) {
      messages.push({ role: 'system', content: this.activeSystemPrompt() });
    }
    // Add all previous messages
    messages.push(...this.messageHistory());
    const modelName = this.selectedModel()?.name ?? '';
    return this.ollamaApiService.sendChatMessage(modelName, messages).subscribe({
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
            content: this.currentResponse()
          }]);
          this.currentResponse.set('');
        }
      },
      error: (error) => {
        console.error('Error sending chat message:', error);
      },
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
}
