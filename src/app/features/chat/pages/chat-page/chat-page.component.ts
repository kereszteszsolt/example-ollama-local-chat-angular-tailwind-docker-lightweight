import { Component, inject } from '@angular/core';
import { ChatInputComponent } from '../../components/chat-page/chat-input/chat-input.component';
import { OllamaService } from '../../services/ollama.service';
import { ChatMessageComponent } from '../../components/chat-page/chat-message/chat-message.component';

@Component({
  selector: 'ollama-chat-chat-page',
  imports: [
    ChatInputComponent,
    ChatMessageComponent
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  ollamaService = inject(OllamaService);
  messages = this.ollamaService.messageHistoryList;
  partialResponse = this.ollamaService.partialResponse;
  isLoading = this.ollamaService.isLoadingResponse;

  onSendMessage(message: string) {
    this.ollamaService.sendChatMessage(message);
  }

  onAbortMessage() {
    this.ollamaService.abortChatMessage();
  }

  onNewChat() {
    this.ollamaService.newChat();
  }

  onRegenerateMessage(ref_id: string) {
    this.ollamaService.regenerateResponse(ref_id);
  }
}
