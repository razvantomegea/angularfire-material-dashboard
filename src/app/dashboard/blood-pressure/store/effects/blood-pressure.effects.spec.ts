import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';
import { BloodPressureEffects } from './blood-pressure.effects';

describe('[Effects] BloodPressure', () => {
  const actions$: Observable<any> = of(null);
  let effects: BloodPressureEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BloodPressureEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(BloodPressureEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
