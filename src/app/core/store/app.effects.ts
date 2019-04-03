import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { AppErrorHandler } from 'app/app-error-handler';
import { map, Observable, tap } from 'app/shared/utils/rxjs-exports';
import { FirebaseError } from 'firebase/app';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppActionTypes, LogError } from './app.actions';

@Injectable()
export class AppEffects {
  @Effect({ dispatch: false })
  public logError$: Observable<FirebaseError | TypeError | Error | SyntaxError | HttpErrorResponse> = this.actions$.pipe(
    ofType(AppActionTypes.LogError),
    map((action: LogError) => action.payload),
    tap((error: FirebaseError | TypeError | Error | SyntaxError | HttpErrorResponse) => {
      this.errorHandler.handleError(error);
      this.loadingBar.complete();
      this.spinnerService.hide();
    })
  );

  constructor(
    private actions$: Actions,
    private errorHandler: AppErrorHandler,
    private loadingBar: LoadingBarService,
    private spinnerService: NgxSpinnerService
  ) {
  }
}
