import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from '../../../models/message.model';
import { NgClass } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TimeSpentPipe } from '../../../pipes/time-spent/time-spent.pipe';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'ollama-chat-chat-message',
  imports: [
    NgClass,
    MarkdownComponent,
    MatIconButton,
    MatIcon,
    TimeSpentPipe,
    MatTooltip
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent implements OnInit {
  @Input({ required: true }) message!: Message;
  @Input({ required: true }) isLoading: boolean = false;
  @Output() regenerate: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {
    (window as any).Prism.plugins.autoloader.languages_path = 'prismjs-components/';
  }

  copyContentToClipboard(content: string): void {
    navigator.clipboard.writeText(content).then(r => 'Copied to clipboard!').catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text to clipboard.');
    });
  }

  onRegenerate(): void {
    if (this.message.ref_id) {
      this.regenerate.emit(this.message.ref_id);
    } else {
      console.warn('Message ID is not available for regeneration.');
    }
  }
}
