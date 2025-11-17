import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MatTooltip} from '@angular/material/tooltip';
import {SystemPromptSettingsComponent} from '../../../dialogs/system-prompt-settings/system-prompt-settings.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'ollama-chat-chat-input',
  imports: [
    MatIconButton,
    MatIcon,
    FormsModule,
    CdkTextareaAutosize,
    MatTooltip,
    MatSlideToggle
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {
  @Input({required: true}) isLoading: boolean = false;
  @Input({required: true}) hasHistory: boolean = false;
  @Output() sendMessage: EventEmitter<string> = new EventEmitter<string>();
  @Output() abort: EventEmitter<void> = new EventEmitter<void>();
  @Output() newChat: EventEmitter<void> = new EventEmitter<void>();
  private dialog = inject(MatDialog);

  currentMessage: string = '';
  thinkEnabled: boolean = false;

  onSendCurrentMessage() {
    if (this.currentMessage.trim()) {
      // Emit a JSON-encoded payload to preserve backward compatibility in event signature
      // The parent will parse and route to service
      this.sendMessage.emit(JSON.stringify({ content: this.currentMessage, think: this.thinkEnabled }));
      this.currentMessage = '';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendCurrentMessage();
    }
  }

  onClearInput() {
    this.currentMessage = '';
  }

  onAbort() {
    this.abort.emit();
  }

  onNewChat() {
    this.newChat.emit();
    this.onClearInput();
  }

  openSystemPromptSettings() {
    const dialogRef = this.dialog.open(SystemPromptSettingsComponent, {
      disableClose: false,
      autoFocus: false,
      restoreFocus: false
    });
    dialogRef.afterClosed().subscribe();
  }
}
