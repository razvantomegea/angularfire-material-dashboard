import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';
import { BloodGlucoseEffects } from './blood-glucose.effects';

describe('[Effects] BloodGlucose', () => {
  const actions$: Observable<any> = of(null);
  let effects: BloodGlucoseEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BloodGlucoseEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(BloodGlucoseEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
