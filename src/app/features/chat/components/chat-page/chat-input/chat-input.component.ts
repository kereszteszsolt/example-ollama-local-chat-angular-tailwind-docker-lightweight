import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MatTooltip} from '@angular/material/tooltip';
import {SystemPromptSettingsComponent} from '../../../dialogs/system-prompt-settings/system-prompt-settings.component';
import {MatDialog} from '@angular/material/dialog';
import {SystemMessage} from '../../../models/message.model';

@Component({
  selector: 'ollama-chat-chat-input',
  imports: [
    MatIconButton,
    MatIcon,
    FormsModule,
    CdkTextareaAutosize,
    MatTooltip
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
      width: '700px',
      disableClose: false,
      autoFocus: false,
      restoreFocus: false
    });
    dialogRef.afterClosed().subscribe();
  }
}
