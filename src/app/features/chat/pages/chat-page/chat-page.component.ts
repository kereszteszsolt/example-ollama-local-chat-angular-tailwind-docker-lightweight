import { Component, inject } from '@angular/core';
import { ChatInputComponent } from '../../components/chat-page/chat-input/chat-input.component';
import { OllamaService } from '../../services/ollama.service';

@Component({
  selector: 'ollama-chat-chat-page',
  imports: [
    ChatInputComponent,
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  ollamaService = inject(OllamaService);
  messages = this.ollamaService.messageHistoryList;
  partialResponse = this.ollamaService.partialResponse;

  onSendMessage(message: string) {
    this.ollamaService.sendChatMessage(message);
  }
}
