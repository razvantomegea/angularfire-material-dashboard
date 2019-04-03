import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromBloodLipids from './blood-lipids.reducer';

export const selectBloodLipidsState = createFeatureSelector<fromBloodLipids.BloodLipidsState>('blood-lipids');

export const getBloodLipids = createSelector(
  selectBloodLipidsState,
  fromBloodLipids.getBloodLipids
);

export const getBloodLipidsTrends = createSelector(
  selectBloodLipidsState,
  fromBloodLipids.getBloodLipidsTrends
);

export const getIsPending = createSelector(
  selectBloodLipidsState,
  fromBloodLipids.getIsPending
);

export * from './blood-lipids.reducer';
