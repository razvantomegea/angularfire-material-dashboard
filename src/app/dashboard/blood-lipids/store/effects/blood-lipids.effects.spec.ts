import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';
import { BloodLipidsEffects } from './blood-lipids.effects';

describe('[Effects] BloodLipids', () => {
  const actions$: Observable<any> = of(null);
  let effects: BloodLipidsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BloodLipidsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(BloodLipidsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
