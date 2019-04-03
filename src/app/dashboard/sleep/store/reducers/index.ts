import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromSleep from './sleep.reducer';

export const selectSleepState = createFeatureSelector<fromSleep.SleepState>('sleep');

export const getIsPending = createSelector(
  selectSleepState,
  fromSleep.getIsPending
);

export const getSleep = createSelector(
  selectSleepState,
  fromSleep.getSleep
);

export const getSleepTrends = createSelector(
  selectSleepState,
  fromSleep.getSleepTrends
);

export * from './sleep.reducer';
