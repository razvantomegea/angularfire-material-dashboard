import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromBloodGlucose from './blood-glucose.reducer';

export const selectBloodGlucoseState = createFeatureSelector<fromBloodGlucose.BloodGlucoseState>('blood-glucose');

export const getBloodGlucose = createSelector(
  selectBloodGlucoseState,
  fromBloodGlucose.getBloodGlucose
);

export const getBloodGlucoseTrends = createSelector(
  selectBloodGlucoseState,
  fromBloodGlucose.getBloodGlucoseTrends
);

export const getIsPending = createSelector(
  selectBloodGlucoseState,
  fromBloodGlucose.getIsPending
);

export * from './blood-glucose.reducer';
