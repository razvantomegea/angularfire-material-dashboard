import { TestBed } from '@angular/core/testing';

import { BloodHomocysteineService } from './blood-homocysteine.service';

describe('[Service] BloodHomocysteine', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BloodHomocysteineService = TestBed.get(BloodHomocysteineService);
    expect(service).toBeTruthy();
  });
});
