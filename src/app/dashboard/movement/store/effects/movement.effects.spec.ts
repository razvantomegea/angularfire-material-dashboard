import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';
import { MovementEffects } from './movement.effects';

describe('[Effects] Movement', () => {
  const actions$: Observable<any> = of(null);
  let effects: MovementEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MovementEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(MovementEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
