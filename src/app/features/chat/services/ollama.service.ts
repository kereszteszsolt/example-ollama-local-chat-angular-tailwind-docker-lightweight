import { inject, Injectable, signal } from '@angular/core';
import { AiModelDto } from '../models/ai-model.model';
import { OllamaApiService } from './ollama-api.service';

@Injectable({
  providedIn: 'root'
})
export class OllamaService {
  private availableModels = signal<AiModelDto[]>([]);
  private selectedModel = signal<AiModelDto | null>(null);

  ollamaApiService = inject(OllamaApiService);

  loadModels() {
    return this.ollamaApiService.getModels().subscribe((response) => {
      this.availableModels.set(response.models)
        if (response.models.length > 0) {
          this.selectedModel.set(response.models[0]);
          console.warn('Current model set to', response.models[0]);
        } else {
          console.warn('OllamaService: No AI models found');
        }
    })
  }

  get aiModels() {
    return this.availableModels;
  }

  get currentModel() {
    return this.selectedModel;
  }

  setCurrentModel(model: AiModelDto | null) {
    console.log('OllamaService: Chose model', model);
    this.selectedModel.set(model);
  }
}
