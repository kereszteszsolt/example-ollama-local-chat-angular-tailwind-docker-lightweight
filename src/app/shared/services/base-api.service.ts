import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {
  protected abstract getResourcePath(): string;

  private getBasePath(): string {
    return 'http://localhost:11434/api';
  }

  protected getUrl(): string {
    return this.getResourcePath() ? `${this.getBasePath()}/${this.getResourcePath()}` : this.getBasePath();
  }
}
