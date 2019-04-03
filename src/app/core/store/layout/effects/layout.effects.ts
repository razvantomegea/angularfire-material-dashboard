import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { StorageService, THEME } from 'app/core/services';
import { State } from 'app/core/store/app.reducers';
import { map, Observable, tap, withLatestFrom } from 'app/shared/utils/rxjs-exports';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeTheme, LayoutActionTypes } from '../actions/app.actions';

@Injectable()
export class LayoutEffects {
  @Effect({ dispatch: false }) public changeTheme$: Observable<string> = this.actions$.pipe(
    ofType(LayoutActionTypes.ChangeTheme),
    map((action: ChangeTheme) => action.payload),
    tap((theme: string) => StorageService.save(THEME, theme))
  );

  @Effect({ dispatch: false }) public toggleLoading$: Observable<number> = this.actions$.pipe(
    ofType(LayoutActionTypes.ToggleLoading),
    withLatestFrom(this.store$),
    map(([_, state]) => state.layout.isLoading),
    tap((isLoading: number) => {
      if (isLoading > 0) {
        this.spinnerService.show();
        this.loadingBar.start(0);
      } else {
        this.spinnerService.hide();
        this.loadingBar.complete();
      }
    })
  );

  constructor(
    private actions$: Actions,
    private loadingBar: LoadingBarService,
    private spinnerService: NgxSpinnerService,
    private store$: Store<State>
  ) {
  }
}
