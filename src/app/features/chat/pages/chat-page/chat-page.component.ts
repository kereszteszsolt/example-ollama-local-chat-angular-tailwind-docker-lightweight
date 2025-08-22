import { AfterViewChecked, Component, ElementRef, inject, ViewChild } from '@angular/core';
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
export class ChatPageComponent implements AfterViewChecked{
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  ollamaService = inject(OllamaService);
  messages = this.ollamaService.messageHistoryList;
  partialResponse = this.ollamaService.partialResponse;
  isLoading = this.ollamaService.isLoadingResponse;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.scrollContainer?.nativeElement) {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

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
