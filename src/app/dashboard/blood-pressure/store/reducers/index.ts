import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromBloodPressure from './blood-pressure.reducer';

export const selectBloodPressureState = createFeatureSelector<fromBloodPressure.BloodPressureState>('blood-pressure');

export const getBloodPressure = createSelector(
  selectBloodPressureState,
  fromBloodPressure.getBloodPressure
);

export const getBloodPressureTrends = createSelector(
  selectBloodPressureState,
  fromBloodPressure.getBloodPressureTrends
);

export const getIsPending = createSelector(
  selectBloodPressureState,
  fromBloodPressure.getIsPending
);

export * from './blood-pressure.reducer';
