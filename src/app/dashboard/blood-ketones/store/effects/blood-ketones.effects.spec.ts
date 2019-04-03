import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';
import { BloodKetonesEffects } from './blood-ketones.effects';

describe('[Effects] BloodKetones', () => {
  const actions$: Observable<any> = of(null);
  let effects: BloodKetonesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BloodKetonesEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(BloodKetonesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
