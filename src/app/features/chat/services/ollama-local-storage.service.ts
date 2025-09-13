import {Injectable} from '@angular/core';
import {SystemMessage} from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class OllamaLocalStorageService {
  STORAGE_KEY = 'ollama-chat-system-prompts';

  getAllMessages(): SystemMessage[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) as SystemMessage[] : [];
  }

  saveAllMessages(messages: SystemMessage[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
  }

  clearAllMessages(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
