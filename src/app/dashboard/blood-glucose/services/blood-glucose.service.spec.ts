import { TestBed } from '@angular/core/testing';

import { BloodGlucoseService } from './blood-glucose.service';

describe('[Service] BloodGlucose', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BloodGlucoseService = TestBed.get(BloodGlucoseService);
    expect(service).toBeTruthy();
  });
});
