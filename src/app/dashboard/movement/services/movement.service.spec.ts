import { TestBed } from '@angular/core/testing';

import { MovementService } from './movement.service';

describe('MovementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MovementService = TestBed.get(MovementService);
    expect(service).toBeTruthy();
  });
});
