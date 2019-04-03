import { TestBed } from '@angular/core/testing';

import { BloodPressureService } from './blood-pressure.service';

describe('[Service] BloodPressure', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BloodPressureService = TestBed.get(BloodPressureService);
    expect(service).toBeTruthy();
  });
});
