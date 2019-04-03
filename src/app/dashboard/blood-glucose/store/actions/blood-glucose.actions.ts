import { Action } from '@ngrx/store';

import { TrendsQuery } from 'app/dashboard/shared/model';
import { BloodGlucose } from '../../model';

export enum BloodGlucoseActionTypes {
  GetBloodGlucoseChanges = '[BloodGlucose] Get Blood Glucose Changes',
  GetBloodGlucoseChangesFailure = '[BloodGlucose] Get Blood Glucose Changes Failure',
  GetBloodGlucoseTrends = '[BloodGlucose] Get Blood Glucose Trends',
  GetBloodGlucoseTrendsFailure = '[BloodGlucose] Get Blood Glucose Trends Failure',
  GetBloodGlucoseTrendsSuccess = '[BloodGlucose] Get Blood Glucose Trends Success',
  QueryTrends = '[BloodGlucose] Query Trends',
  SaveBloodGlucose = '[BloodGlucose] Save Blood Glucose',
  SaveBloodGlucoseFailure = '[BloodGlucose] Save Blood Glucose Failure',
  SaveBloodGlucoseSuccess = '[BloodGlucose] Save Blood Glucose Success'
}

export class GetBloodGlucoseChanges implements Action {
  readonly type = BloodGlucoseActionTypes.GetBloodGlucoseChanges;

  constructor() {
  }
}

export class GetBloodGlucoseChangesFailure implements Action {
  readonly type = BloodGlucoseActionTypes.GetBloodGlucoseChangesFailure;

  constructor() {
  }
}

export class GetBloodGlucoseTrends implements Action {
  readonly type = BloodGlucoseActionTypes.GetBloodGlucoseTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class GetBloodGlucoseTrendsFailure implements Action {
  readonly type = BloodGlucoseActionTypes.GetBloodGlucoseTrendsFailure;

  constructor() {
  }
}

export class GetBloodGlucoseTrendsSuccess implements Action {
  readonly type = BloodGlucoseActionTypes.GetBloodGlucoseTrendsSuccess;

  constructor(public payload: BloodGlucose[]) {
  }
}

export class QueryTrends implements Action {
  readonly type = BloodGlucoseActionTypes.QueryTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class SaveBloodGlucose implements Action {
  readonly type = BloodGlucoseActionTypes.SaveBloodGlucose;

  constructor(public payload: BloodGlucose) {
  }
}

export class SaveBloodGlucoseFailure implements Action {
  readonly type = BloodGlucoseActionTypes.SaveBloodGlucoseFailure;

  constructor() {
  }
}

export class SaveBloodGlucoseSuccess implements Action {
  readonly type = BloodGlucoseActionTypes.SaveBloodGlucoseSuccess;

  constructor(public payload: BloodGlucose) {
  }
}

export type BloodGlucoseActionsUnion =
  GetBloodGlucoseChanges
  | GetBloodGlucoseChangesFailure
  | GetBloodGlucoseTrends
  | GetBloodGlucoseTrendsFailure
  | GetBloodGlucoseTrendsSuccess
  | QueryTrends
  | SaveBloodGlucose
  | SaveBloodGlucoseFailure
  | SaveBloodGlucoseSuccess;
