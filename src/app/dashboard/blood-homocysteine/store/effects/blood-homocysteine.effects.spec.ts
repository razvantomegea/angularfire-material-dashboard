import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';
import { BloodHomocysteineEffects } from './blood-homocysteine.effects';

describe('[Effects] BloodHomocysteine', () => {
  const actions$: Observable<any> = of(null);
  let effects: BloodHomocysteineEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BloodHomocysteineEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(BloodHomocysteineEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
