import { Component } from '@angular/core';
import { ChatInputComponent } from '../../components/chat-page/chat-input/chat-input.component';

@Component({
  selector: 'ollama-chat-chat-page',
  imports: [
    ChatInputComponent
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {

}
