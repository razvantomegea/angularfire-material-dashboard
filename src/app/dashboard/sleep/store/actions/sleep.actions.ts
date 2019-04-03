import { Action } from '@ngrx/store';

import { TrendsQuery } from 'app/dashboard/shared/model';
import { Sleep } from '../../model';

export enum SleepActionTypes {
  GetSleepChanges = '[Sleep] Get Sleep Changes',
  GetSleepChangesFailure = '[Sleep] Get Sleep Changes Failure',
  GetSleepTrends = '[Sleep] Get Sleep Trends',
  GetSleepTrendsFailure = '[Sleep] Get Sleep Trends Failure',
  GetSleepTrendsSuccess = '[Sleep] Get Sleep Trends Success',
  QueryTrends = '[Sleep] Query Trends',
  SaveSleep = '[Sleep] Save Sleep',
  SaveSleepFailure = '[Sleep] Save Sleep Failure',
  SaveSleepSuccess = '[Sleep] Save Sleep Success'
}

export class GetSleepChanges implements Action {
  readonly type = SleepActionTypes.GetSleepChanges;

  constructor() {
  }
}

export class GetSleepChangesFailure implements Action {
  readonly type = SleepActionTypes.GetSleepChangesFailure;

  constructor() {
  }
}

export class GetSleepTrends implements Action {
  readonly type = SleepActionTypes.GetSleepTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class GetSleepTrendsFailure implements Action {
  readonly type = SleepActionTypes.GetSleepTrendsFailure;

  constructor() {
  }
}

export class GetSleepTrendsSuccess implements Action {
  readonly type = SleepActionTypes.GetSleepTrendsSuccess;

  constructor(public payload: Sleep[]) {
  }
}

export class QueryTrends implements Action {
  readonly type = SleepActionTypes.QueryTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class SaveSleep implements Action {
  readonly type = SleepActionTypes.SaveSleep;

  constructor(public payload: Sleep) {
  }
}

export class SaveSleepFailure implements Action {
  readonly type = SleepActionTypes.SaveSleepFailure;

  constructor() {
  }
}

export class SaveSleepSuccess implements Action {
  readonly type = SleepActionTypes.SaveSleepSuccess;

  constructor(public payload: Sleep) {
  }
}

export type SleepActionsUnion =
  GetSleepChanges
  | GetSleepChangesFailure
  | GetSleepTrends
  | GetSleepTrendsFailure
  | GetSleepTrendsSuccess
  | QueryTrends
  | SaveSleep
  | SaveSleepFailure
  | SaveSleepSuccess;
