import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../shared/services/base-api.service';
import { HttpClient } from '@angular/common/http';
import { AiModelDto } from '../models/ai-model.model';

@Injectable({
  providedIn: 'root'
})
export class OllamaApiService extends BaseApiService{
  constructor(private http: HttpClient) {
    super();
  }

  protected override getResourcePath(): string {
    return '';
  }

  getModels() {
    return this.http.get<{models: AiModelDto[]}>(`${this.getUrl()}/tags`);
  }
}
