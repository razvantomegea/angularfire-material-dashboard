import { Action } from '@ngrx/store';

import { BodyComposition } from 'app/dashboard/body-composition/model';

export enum BodyCompositionActionTypes {
  GetBodyCompositionTrends = '[BodyComposition] Get Body Composition Trends',
  GetBodyCompositionTrendsFailure = '[BodyComposition] Get Body Composition Trends Failure',
  GetBodyCompositionTrendsSuccess = '[BodyComposition] Get Body Composition Trends Success',
  SaveBodyComposition = '[BodyComposition] Save Body Composition',
  SaveBodyCompositionFailure = '[BodyComposition] Save Body Composition Failure',
  SaveBodyCompositionSuccess = '[BodyComposition] Save Body Composition Success',
  GetBodyCompositionChanges = '[BodyComposition] Get BodyComposition Changes',
  GetBodyCompositionChangesFailure = '[BodyComposition] Get BodyComposition Changes'
}

export class GetBodyCompositionTrends implements Action {
  readonly type = BodyCompositionActionTypes.GetBodyCompositionTrends;

  constructor(public payload: string) {
  }
}

export class GetBodyCompositionTrendsFailure implements Action {
  readonly type = BodyCompositionActionTypes.GetBodyCompositionTrendsFailure;

  constructor() {
  }
}

export class GetBodyCompositionTrendsSuccess implements Action {
  readonly type = BodyCompositionActionTypes.GetBodyCompositionTrendsSuccess;

  constructor(public payload: BodyComposition[]) {
  }
}

export class SaveBodyComposition implements Action {
  readonly type = BodyCompositionActionTypes.SaveBodyComposition;

  constructor(public payload: BodyComposition) {
  }
}

export class SaveBodyCompositionFailure implements Action {
  readonly type = BodyCompositionActionTypes.SaveBodyCompositionFailure;

  constructor() {
  }
}

export class SaveBodyCompositionSuccess implements Action {
  readonly type = BodyCompositionActionTypes.SaveBodyCompositionSuccess;

  constructor(public payload: BodyComposition) {
  }
}

export class GetBodyCompositionChanges implements Action {
  readonly type = BodyCompositionActionTypes.GetBodyCompositionChanges;

  constructor() {
  }
}

export class GetBodyCompositionChangesFailure implements Action {
  readonly type = BodyCompositionActionTypes.GetBodyCompositionChangesFailure;

  constructor() {
  }
}

export type BodyCompositionActionsUnion =
  GetBodyCompositionTrends
  | GetBodyCompositionTrendsFailure
  | GetBodyCompositionTrendsSuccess
  | SaveBodyComposition
  | SaveBodyCompositionFailure
  | SaveBodyCompositionSuccess
  | GetBodyCompositionChanges
  | GetBodyCompositionChangesFailure;
