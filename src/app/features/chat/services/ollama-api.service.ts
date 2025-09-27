import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../shared/services/base-api.service';
import { HttpClient } from '@angular/common/http';
import { AiModelDto } from '../models/ai-model.model';
import { Message } from '../models/message.model';
import { Observable } from 'rxjs';

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

  sendChatMessage(model: string, messages: Message[], stream: boolean = true): Observable<any> {
    const reqData = {
      model: model,
      messages: messages,
      stream: stream
    };
    return this.http.post(`${this.getUrl()}/chat`, reqData, {
      responseType: 'text' as 'json',
      observe: 'events',
      headers: {
        'Content-Type': 'application/json'
      },
      reportProgress: true
    });
  }
}
