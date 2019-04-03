import { TestBed } from '@angular/core/testing';

import { BloodKetonesService } from './blood-ketones.service';

describe('[Service] BloodKetones', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BloodKetonesService = TestBed.get(BloodKetonesService);
    expect(service).toBeTruthy();
  });
});
