import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';

import { FoodsEffects } from './foods.effects';

describe('FoodsService', () => {
  const actions$: Observable<any> = of(null);
  let effects: FoodsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FoodsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(FoodsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
