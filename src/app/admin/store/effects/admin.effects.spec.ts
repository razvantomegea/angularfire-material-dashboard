import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';
import { AdminEffects } from './admin.effects';

describe('AdminService', () => {
  const actions$: Observable<any> = of(null);
  let effects: AdminEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(AdminEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
