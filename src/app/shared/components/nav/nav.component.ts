import { Component, inject, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { OllamaService } from '../../../features/chat/services/ollama.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'ollama-chat-nav',
  imports: [
    MatIcon,
    MatIconButton,
    MatToolbar,
    MatMenu,
    MatMenuItem,
    MatButton,
    MatMenuTrigger
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit {
  ollamaService = inject(OllamaService);
  currentModel = this.ollamaService.currentModel;
  availableModels = this.ollamaService.aiModels;

  ngOnInit() {
    this.ollamaService.loadModels();
  }

  onModelChange(selectedModel: string) {
    const model = this.availableModels().find(m => m.name === selectedModel);

    if (model) {
      this.ollamaService.setCurrentModel(model);
    } else {
      console.warn(`Model not found: ${selectedModel}`);
    }
  }
}
