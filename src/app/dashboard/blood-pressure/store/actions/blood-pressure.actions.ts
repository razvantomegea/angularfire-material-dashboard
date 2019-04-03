import { Action } from '@ngrx/store';

import { TrendsQuery } from 'app/dashboard/shared/model';
import { BloodPressure } from '../../model';

export enum BloodPressureActionTypes {
  GetBloodPressureChanges = '[BloodPressure] Get Blood Pressure Changes',
  GetBloodPressureChangesFailure = '[BloodPressure] Get Blood Pressure Changes Failure',
  GetBloodPressureTrends = '[BloodPressure] Get Blood Pressure Trends',
  GetBloodPressureTrendsFailure = '[BloodPressure] Get Blood Pressure Trends Failure',
  GetBloodPressureTrendsSuccess = '[BloodPressure] Get Blood Pressure Trends Success',
  QueryTrends = '[BloodPressure] Query Trends',
  SaveBloodPressure = '[BloodPressure] Save Blood Pressure',
  SaveBloodPressureFailure = '[BloodPressure] Save Blood Pressure Failure',
  SaveBloodPressureSuccess = '[BloodPressure] Save Blood Pressure Success'
}

export class GetBloodPressureChanges implements Action {
  readonly type = BloodPressureActionTypes.GetBloodPressureChanges;

  constructor() {
  }
}

export class GetBloodPressureChangesFailure implements Action {
  readonly type = BloodPressureActionTypes.GetBloodPressureChangesFailure;

  constructor() {
  }
}

export class GetBloodPressureTrends implements Action {
  readonly type = BloodPressureActionTypes.GetBloodPressureTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class GetBloodPressureTrendsFailure implements Action {
  readonly type = BloodPressureActionTypes.GetBloodPressureTrendsFailure;

  constructor() {
  }
}

export class GetBloodPressureTrendsSuccess implements Action {
  readonly type = BloodPressureActionTypes.GetBloodPressureTrendsSuccess;

  constructor(public payload: BloodPressure[]) {
  }
}

export class QueryTrends implements Action {
  readonly type = BloodPressureActionTypes.QueryTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class SaveBloodPressure implements Action {
  readonly type = BloodPressureActionTypes.SaveBloodPressure;

  constructor(public payload: BloodPressure) {
  }
}

export class SaveBloodPressureFailure implements Action {
  readonly type = BloodPressureActionTypes.SaveBloodPressureFailure;

  constructor() {
  }
}

export class SaveBloodPressureSuccess implements Action {
  readonly type = BloodPressureActionTypes.SaveBloodPressureSuccess;

  constructor(public payload: BloodPressure) {
  }
}

export type BloodPressureActionsUnion =
  GetBloodPressureChanges
  | GetBloodPressureChangesFailure
  | GetBloodPressureTrends
  | GetBloodPressureTrendsFailure
  | GetBloodPressureTrendsSuccess
  | QueryTrends
  | SaveBloodPressure
  | SaveBloodPressureFailure
  | SaveBloodPressureSuccess;
