import { Action } from '@ngrx/store';

import { TrendsQuery } from 'app/dashboard/shared/model';
import { BloodKetones } from '../../model';

export enum BloodKetonesActionTypes {
  GetBloodKetonesChanges = '[BloodKetones] Get Blood Ketones Changes',
  GetBloodKetonesChangesFailure = '[BloodKetones] Get Blood Ketones Changes Failure',
  GetBloodKetonesTrends = '[BloodKetones] Get Blood Ketones Trends',
  GetBloodKetonesTrendsFailure = '[BloodKetones] Get Blood Ketones Trends Failure',
  GetBloodKetonesTrendsSuccess = '[BloodKetones] Get Blood Ketones Trends Success',
  QueryTrends = '[BloodKetones] Query Trends',
  SaveBloodKetones = '[BloodKetones] Save Blood Ketones',
  SaveBloodKetonesFailure = '[BloodKetones] Save Blood Ketones Failure',
  SaveBloodKetonesSuccess = '[BloodKetones] Save Blood Ketones Success'
}

export class GetBloodKetonesChanges implements Action {
  readonly type = BloodKetonesActionTypes.GetBloodKetonesChanges;

  constructor() {
  }
}

export class GetBloodKetonesChangesFailure implements Action {
  readonly type = BloodKetonesActionTypes.GetBloodKetonesChangesFailure;

  constructor() {
  }
}

export class GetBloodKetonesTrends implements Action {
  readonly type = BloodKetonesActionTypes.GetBloodKetonesTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class GetBloodKetonesTrendsFailure implements Action {
  readonly type = BloodKetonesActionTypes.GetBloodKetonesTrendsFailure;

  constructor() {
  }
}

export class GetBloodKetonesTrendsSuccess implements Action {
  readonly type = BloodKetonesActionTypes.GetBloodKetonesTrendsSuccess;

  constructor(public payload: BloodKetones[]) {
  }
}

export class QueryTrends implements Action {
  readonly type = BloodKetonesActionTypes.QueryTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class SaveBloodKetones implements Action {
  readonly type = BloodKetonesActionTypes.SaveBloodKetones;

  constructor(public payload: BloodKetones) {
  }
}

export class SaveBloodKetonesFailure implements Action {
  readonly type = BloodKetonesActionTypes.SaveBloodKetonesFailure;

  constructor() {
  }
}

export class SaveBloodKetonesSuccess implements Action {
  readonly type = BloodKetonesActionTypes.SaveBloodKetonesSuccess;

  constructor(public payload: BloodKetones) {
  }
}

export type BloodKetonesActionsUnion =
  GetBloodKetonesChanges
  | GetBloodKetonesChangesFailure
  | GetBloodKetonesTrends
  | GetBloodKetonesTrendsFailure
  | GetBloodKetonesTrendsSuccess
  | QueryTrends
  | SaveBloodKetones
  | SaveBloodKetonesFailure
  | SaveBloodKetonesSuccess;
