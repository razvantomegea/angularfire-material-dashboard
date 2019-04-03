import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { FirebaseError } from 'firebase/app';

export enum AppActionTypes {
  LogError = '[App] Log Error'
}

export class LogError implements Action {
  readonly type = AppActionTypes.LogError;

  constructor(public payload: FirebaseError | TypeError | Error | SyntaxError | HttpErrorResponse) {
  }
}

export type AppActions = LogError;
