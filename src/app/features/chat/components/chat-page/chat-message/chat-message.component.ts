import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ollama-chat-chat-message',
  imports: [
    NgClass
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  @Input({ required: true }) message!: Message;
}
