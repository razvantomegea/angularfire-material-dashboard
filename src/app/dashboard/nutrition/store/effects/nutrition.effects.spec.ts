import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';
import { NutritionEffects } from './nutrition.effects';

describe('FoodsService', () => {
  const actions$: Observable<any> = of(null);
  let effects: NutritionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NutritionEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(NutritionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
