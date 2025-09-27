import { TestBed } from '@angular/core/testing';

import { OllamaLocalStorageService } from './ollama-local-storage.service';

describe('OllamaLocalStorageService', () => {
  let service: OllamaLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OllamaLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
