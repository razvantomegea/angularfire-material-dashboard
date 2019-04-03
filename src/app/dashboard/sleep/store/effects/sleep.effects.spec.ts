import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';
import { SleepEffects } from './sleep.effects';

describe('[Effects] Sleep', () => {
  const actions$: Observable<any> = of(null);
  let effects: SleepEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SleepEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(SleepEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
