import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { Observable, of } from 'app/shared/utils/rxjs-exports';
import { LayoutEffects } from './layout.effects';

describe('LayoutEffects', () => {
  const actions$: Observable<any> = of(null);
  let effects: LayoutEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LayoutEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(LayoutEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
