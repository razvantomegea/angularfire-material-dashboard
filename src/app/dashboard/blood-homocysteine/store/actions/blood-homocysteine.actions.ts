import { Action } from '@ngrx/store';

import { TrendsQuery } from 'app/dashboard/shared/model';
import { BloodHomocysteine } from '../../model';

export enum BloodHomocysteineActionTypes {
  GetBloodHomocysteineChanges = '[BloodHomocysteine] Get Blood Homocysteine Changes',
  GetBloodHomocysteineChangesFailure = '[BloodHomocysteine] Get Blood Homocysteine Changes Failure',
  GetBloodHomocysteineTrends = '[BloodHomocysteine] Get Blood Homocysteine Trends',
  GetBloodHomocysteineTrendsFailure = '[BloodHomocysteine] Get Blood Homocysteine Trends Failure',
  GetBloodHomocysteineTrendsSuccess = '[BloodHomocysteine] Get Blood Homocysteine Trends Success',
  QueryTrends = '[BloodHomocysteine] Query Trends',
  SaveBloodHomocysteine = '[BloodHomocysteine] Save Blood Homocysteine',
  SaveBloodHomocysteineFailure = '[BloodHomocysteine] Save Blood Homocysteine Failure',
  SaveBloodHomocysteineSuccess = '[BloodHomocysteine] Save Blood Homocysteine Success'
}

export class GetBloodHomocysteineChanges implements Action {
  readonly type = BloodHomocysteineActionTypes.GetBloodHomocysteineChanges;

  constructor() {
  }
}

export class GetBloodHomocysteineChangesFailure implements Action {
  readonly type = BloodHomocysteineActionTypes.GetBloodHomocysteineChangesFailure;

  constructor() {
  }
}

export class GetBloodHomocysteineTrends implements Action {
  readonly type = BloodHomocysteineActionTypes.GetBloodHomocysteineTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class GetBloodHomocysteineTrendsFailure implements Action {
  readonly type = BloodHomocysteineActionTypes.GetBloodHomocysteineTrendsFailure;

  constructor() {
  }
}

export class GetBloodHomocysteineTrendsSuccess implements Action {
  readonly type = BloodHomocysteineActionTypes.GetBloodHomocysteineTrendsSuccess;

  constructor(public payload: BloodHomocysteine[]) {
  }
}

export class QueryTrends implements Action {
  readonly type = BloodHomocysteineActionTypes.QueryTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class SaveBloodHomocysteine implements Action {
  readonly type = BloodHomocysteineActionTypes.SaveBloodHomocysteine;

  constructor(public payload: BloodHomocysteine) {
  }
}

export class SaveBloodHomocysteineFailure implements Action {
  readonly type = BloodHomocysteineActionTypes.SaveBloodHomocysteineFailure;

  constructor() {
  }
}

export class SaveBloodHomocysteineSuccess implements Action {
  readonly type = BloodHomocysteineActionTypes.SaveBloodHomocysteineSuccess;

  constructor(public payload: BloodHomocysteine) {
  }
}

export type BloodHomocysteineActionsUnion =
  GetBloodHomocysteineChanges
  | GetBloodHomocysteineChangesFailure
  | GetBloodHomocysteineTrends
  | GetBloodHomocysteineTrendsFailure
  | GetBloodHomocysteineTrendsSuccess
  | QueryTrends
  | SaveBloodHomocysteine
  | SaveBloodHomocysteineFailure
  | SaveBloodHomocysteineSuccess;
