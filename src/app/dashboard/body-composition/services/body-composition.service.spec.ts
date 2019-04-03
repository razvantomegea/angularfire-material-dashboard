import { TestBed } from '@angular/core/testing';

import { BodyCompositionService } from './body-composition.service';

describe('[Service] BodyComposition', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BodyCompositionService = TestBed.get(BodyCompositionService);
    expect(service).toBeTruthy();
  });
});
