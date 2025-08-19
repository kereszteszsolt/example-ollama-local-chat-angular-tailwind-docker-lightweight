import { Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'ollama-chat-chat-input',
  imports: [
    MatIconButton,
    MatIcon,
    MatButton
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent {

}
