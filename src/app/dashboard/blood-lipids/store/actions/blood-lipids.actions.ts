import { Action } from '@ngrx/store';

import { TrendsQuery } from 'app/dashboard/shared/model';
import { BloodLipids } from '../../model';

export enum BloodLipidsActionTypes {
  GetBloodLipidsChanges = '[BloodLipids] Get Blood Lipids Changes',
  GetBloodLipidsChangesFailure = '[BloodLipids] Get Blood Lipids Changes Failure',
  GetBloodLipidsTrends = '[BloodLipids] Get Blood Lipids Trends',
  GetBloodLipidsTrendsFailure = '[BloodLipids] Get Blood Lipids Trends Failure',
  GetBloodLipidsTrendsSuccess = '[BloodLipids] Get Blood Lipids Trends Success',
  QueryTrends = '[BloodLipids] Query Trends',
  SaveBloodLipids = '[BloodLipids] Save Blood Lipids',
  SaveBloodLipidsFailure = '[BloodLipids] Save Blood Lipids Failure',
  SaveBloodLipidsSuccess = '[BloodLipids] Save Blood Lipids Success'
}

export class GetBloodLipidsChanges implements Action {
  readonly type = BloodLipidsActionTypes.GetBloodLipidsChanges;

  constructor() {
  }
}

export class GetBloodLipidsChangesFailure implements Action {
  readonly type = BloodLipidsActionTypes.GetBloodLipidsChangesFailure;

  constructor() {
  }
}

export class GetBloodLipidsTrends implements Action {
  readonly type = BloodLipidsActionTypes.GetBloodLipidsTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class GetBloodLipidsTrendsFailure implements Action {
  readonly type = BloodLipidsActionTypes.GetBloodLipidsTrendsFailure;

  constructor() {
  }
}

export class GetBloodLipidsTrendsSuccess implements Action {
  readonly type = BloodLipidsActionTypes.GetBloodLipidsTrendsSuccess;

  constructor(public payload: BloodLipids[]) {
  }
}

export class QueryTrends implements Action {
  readonly type = BloodLipidsActionTypes.QueryTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class SaveBloodLipids implements Action {
  readonly type = BloodLipidsActionTypes.SaveBloodLipids;

  constructor(public payload: BloodLipids) {
  }
}

export class SaveBloodLipidsFailure implements Action {
  readonly type = BloodLipidsActionTypes.SaveBloodLipidsFailure;

  constructor() {
  }
}

export class SaveBloodLipidsSuccess implements Action {
  readonly type = BloodLipidsActionTypes.SaveBloodLipidsSuccess;

  constructor(public payload: BloodLipids) {
  }
}

export type BloodLipidsActionsUnion =
  GetBloodLipidsChanges
  | GetBloodLipidsChangesFailure
  | GetBloodLipidsTrends
  | GetBloodLipidsTrendsFailure
  | GetBloodLipidsTrendsSuccess
  | QueryTrends
  | SaveBloodLipids
  | SaveBloodLipidsFailure
  | SaveBloodLipidsSuccess;
