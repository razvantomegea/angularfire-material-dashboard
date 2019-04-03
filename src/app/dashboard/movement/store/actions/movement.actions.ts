import { Action } from '@ngrx/store';

import { TrendsQuery } from 'app/dashboard/shared/model';
import { Activity, ActivityQuery, Movement, Session } from '../../model';

export enum MovementActionTypes {
  DeleteFavoriteSession = '[Movement] Delete Favorite Session',
  DeleteFavoriteSessionFailure = '[Movement] Delete Favorite Session Failure',
  DeleteFavoriteSessionSuccess = '[Movement] Delete Favorite Session Success',
  DeleteSession = '[Movement] Delete Session',
  GetActivitiesChanges = '[Movement] Get Activities Changes',
  GetActivitiesChangesFailure = '[Movement] Get Activities Changes Failure',
  GetActivitiesChangesSuccess = '[Movement] Get Activities Changes Success',
  GetMovementChanges = '[Movement] Get Movement Changes',
  GetMovementChangesFailure = '[Movement] Get Movement Changes Failure',
  GetMovementTrends = '[Movement] Get Movement Trends',
  GetMovementTrendsFailure = '[Movement] Get Movement Trends Failure',
  GetMovementTrendsSuccess = '[Movement] Get Movement Trends Success',
  GetFavoriteSessionsChanges = '[Movement] Get Favorite Session Changes',
  GetFavoriteSessionsChangesFailure = '[Movement] Get Favorite Session Changes Failure',
  GetFavoriteSessionsChangesSuccess = '[Movement] Get Favorite Session Changes Success',
  QueryActivities = '[Movement] Query Activities',
  QueryTrends = '[Movement] Query Trends',
  QueryFavoriteSessions = '[Movement] Query Favorite Sessions',
  SaveSession = '[Movement] Save Session',
  SaveMovement = '[Movement] Save Movement',
  SaveMovementFailure = '[Movement] Save Movement Failure',
  SaveMovementSuccess = '[Movement] Save Movement Success',
  SaveFavoriteSession = '[Movement] Save Favorite Session',
  SaveFavoriteSessionFailure = '[Movement] Save Favorite Session Failure',
  SaveFavoriteSessionSuccess = '[Movement] Save Favorite Session Success',
  SelectSession = '[Movement] Select Session',
  SelectSessionFailure = '[Movement] Select Session Failure',
  SelectSessionSuccess = '[Movement] Select Session Success'
}

export class DeleteFavoriteSession implements Action {
  readonly type = MovementActionTypes.DeleteFavoriteSession;

  constructor(public payload: Session) {
  }
}

export class DeleteFavoriteSessionFailure implements Action {
  readonly type = MovementActionTypes.DeleteFavoriteSessionFailure;

  constructor() {
  }
}

export class DeleteFavoriteSessionSuccess implements Action {
  readonly type = MovementActionTypes.DeleteFavoriteSessionSuccess;

  constructor(public payload: string) {
  }
}

export class DeleteSession implements Action {
  readonly type = MovementActionTypes.DeleteSession;

  constructor(public payload: Session) {
  }
}

export class GetActivitiesChanges implements Action {
  readonly type = MovementActionTypes.GetActivitiesChanges;

  constructor(public payload: ActivityQuery) {
  }
}

export class GetActivitiesChangesFailure implements Action {
  readonly type = MovementActionTypes.GetActivitiesChangesFailure;

  constructor() {
  }
}

export class GetActivitiesChangesSuccess implements Action {
  readonly type = MovementActionTypes.GetActivitiesChangesSuccess;

  constructor(public payload: Activity[]) {
  }
}


export class GetMovementChanges implements Action {
  readonly type = MovementActionTypes.GetMovementChanges;

  constructor() {
  }
}

export class GetMovementChangesFailure implements Action {
  readonly type = MovementActionTypes.GetMovementChangesFailure;

  constructor() {
  }
}

export class GetMovementTrends implements Action {
  readonly type = MovementActionTypes.GetMovementTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class GetMovementTrendsFailure implements Action {
  readonly type = MovementActionTypes.GetMovementTrendsFailure;

  constructor() {
  }
}

export class GetMovementTrendsSuccess implements Action {
  readonly type = MovementActionTypes.GetMovementTrendsSuccess;

  constructor(public payload: Movement[]) {
  }
}

export class GetFavoriteSessionsChanges implements Action {
  readonly type = MovementActionTypes.GetFavoriteSessionsChanges;

  constructor() {
  }
}

export class GetFavoriteSessionsChangesFailure implements Action {
  readonly type = MovementActionTypes.GetFavoriteSessionsChangesFailure;

  constructor() {
  }
}

export class GetFavoriteSessionsChangesSuccess implements Action {
  readonly type = MovementActionTypes.GetFavoriteSessionsChangesSuccess;

  constructor(public payload: Session[]) {
  }
}

export class QueryActivities implements Action {
  readonly type = MovementActionTypes.QueryActivities;

  constructor(public payload: ActivityQuery) {
  }
}

export class QueryTrends implements Action {
  readonly type = MovementActionTypes.QueryTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class QueryFavoriteSessions implements Action {
  readonly type = MovementActionTypes.QueryFavoriteSessions;

  constructor(public payload: string) {
  }
}

export class SaveSession implements Action {
  readonly type = MovementActionTypes.SaveSession;

  constructor(public payload: Session) {
  }
}

export class SaveMovement implements Action {
  readonly type = MovementActionTypes.SaveMovement;

  constructor(public payload: Movement) {
  }
}

export class SaveMovementFailure implements Action {
  readonly type = MovementActionTypes.SaveMovementFailure;

  constructor() {
  }
}

export class SaveMovementSuccess implements Action {
  readonly type = MovementActionTypes.SaveMovementSuccess;

  constructor(public payload: Movement) {
  }
}

export class SaveFavoriteSession implements Action {
  readonly type = MovementActionTypes.SaveFavoriteSession;

  constructor(public payload: Session) {
  }
}

export class SaveFavoriteSessionFailure implements Action {
  readonly type = MovementActionTypes.SaveFavoriteSessionFailure;

  constructor() {
  }
}

export class SaveFavoriteSessionSuccess implements Action {
  readonly type = MovementActionTypes.SaveFavoriteSessionSuccess;

  constructor(public payload: Session) {
  }
}

export class SelectSession implements Action {
  readonly type = MovementActionTypes.SelectSession;

  constructor(public payload: string) {
  }
}

export class SelectSessionFailure implements Action {
  readonly type = MovementActionTypes.SelectSessionFailure;

  constructor() {
  }
}

export class SelectSessionSuccess implements Action {
  readonly type = MovementActionTypes.SelectSessionSuccess;

  constructor(public payload: Session) {
  }
}

export type MovementActionsUnion =
  DeleteFavoriteSession
  | DeleteFavoriteSessionFailure
  | DeleteFavoriteSessionSuccess
  | DeleteSession
  | GetActivitiesChanges
  | GetActivitiesChangesFailure
  | GetActivitiesChangesSuccess
  | GetMovementChanges
  | GetMovementChangesFailure
  | GetMovementTrends
  | GetMovementTrendsFailure
  | GetMovementTrendsSuccess
  | GetFavoriteSessionsChanges
  | GetFavoriteSessionsChangesFailure
  | GetFavoriteSessionsChangesSuccess
  | QueryActivities
  | QueryFavoriteSessions
  | QueryTrends
  | SaveSession
  | SaveMovement
  | SaveMovementFailure
  | SaveMovementSuccess
  | SaveFavoriteSession
  | SaveFavoriteSessionFailure
  | SaveFavoriteSessionSuccess
  | SelectSession
  | SelectSessionFailure
  | SelectSessionSuccess;
