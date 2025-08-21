import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../../../models/message.model';
import { NgClass } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'ollama-chat-chat-message',
  imports: [
    NgClass,
    MarkdownComponent
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent implements OnInit {
  @Input({ required: true }) message!: Message;

  ngOnInit(): void {
    (window as any).Prism.plugins.autoloader.languages_path = 'prismjs-components/';
  }
}
