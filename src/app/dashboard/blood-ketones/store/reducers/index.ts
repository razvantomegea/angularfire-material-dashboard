import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromBloodKetones from './blood-ketones.reducer';

export const selectBloodKetonesState = createFeatureSelector<fromBloodKetones.BloodKetonesState>('bloodKetones');

export const getBloodKetones = createSelector(
  selectBloodKetonesState,
  fromBloodKetones.getBloodKetones
);

export const getBloodKetonesTrends = createSelector(
  selectBloodKetonesState,
  fromBloodKetones.getBloodKetonesTrends
);

export const getIsPending = createSelector(
  selectBloodKetonesState,
  fromBloodKetones.getIsPending
);

export * from './blood-ketones.reducer';
