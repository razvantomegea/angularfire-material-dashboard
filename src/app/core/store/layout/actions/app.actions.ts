import { Action } from '@ngrx/store';

export enum LayoutActionTypes {
  ChangeTheme = '[Layout] Change Theme',
  ToggleLoading = '[Layout] Toggle Loading'
}

export class ChangeTheme implements Action {
  readonly type = LayoutActionTypes.ChangeTheme;

  constructor(public payload: string) {
  }
}

export class ToggleLoading implements Action {
  readonly type = LayoutActionTypes.ToggleLoading;

  constructor(public payload: boolean) {
  }
}

export type LayoutActionsUnion = ChangeTheme | ToggleLoading;
