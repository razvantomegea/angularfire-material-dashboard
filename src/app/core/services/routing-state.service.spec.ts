import { TestBed } from '@angular/core/testing';

import { RoutingStateService } from './routing-state.service';

describe('RoutingStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutingStateService = TestBed.get(RoutingStateService);
    expect(service).toBeTruthy();
  });
});
