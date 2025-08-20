import { Component, EventEmitter, Output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ollama-chat-chat-input',
  imports: [
    MatIconButton,
    MatIcon,
    MatButton,
    FormsModule
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  @Output() sendMessage: EventEmitter<string> = new EventEmitter<string>();

  currentMessage: string = '';

  onSendCurrentMessage() {
    if (this.currentMessage.trim()) {
      this.sendMessage.emit(this.currentMessage);
      this.currentMessage = '';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendCurrentMessage();
    }
  }
}
