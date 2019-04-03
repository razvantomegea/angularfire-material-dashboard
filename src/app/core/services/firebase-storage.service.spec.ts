import { TestBed, inject } from '@angular/core/testing';

import { FirebaseStorageService } from './firebase-storage.service';

describe('FirebaseStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseStorageService]
    });
  });

  it('should be created', inject([FirebaseStorageService], (service: FirebaseStorageService) => {
    expect(service).toBeTruthy();
  }));
});
