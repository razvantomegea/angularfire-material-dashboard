import { TestBed, inject } from '@angular/core/testing';

import { BodyCompositionService } from './services/body-composition.service';

describe('BodyCompositionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BodyCompositionService]
    });
  });

  it('should be created', inject([BodyCompositionService], (service: BodyCompositionService) => {
    expect(service).toBeTruthy();
  }));
});
