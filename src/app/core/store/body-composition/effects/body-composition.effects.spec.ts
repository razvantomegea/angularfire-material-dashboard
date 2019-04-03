import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';
import { BodyCompositionEffects } from './body-composition.effects';

describe('BodyCompositionEffects', () => {
  const actions$: Observable<any> = of(null);
  let effects: BodyCompositionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BodyCompositionEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(BodyCompositionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
