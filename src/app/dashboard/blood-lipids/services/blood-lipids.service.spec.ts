import { TestBed } from '@angular/core/testing';

import { BloodLipidsService } from './blood-lipids.service';

describe('[Service] BloodLipids', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BloodLipidsService = TestBed.get(BloodLipidsService);
    expect(service).toBeTruthy();
  });
});
