import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromBloodHomocysteine from './blood-homocysteine.reducer';

export const selectBloodHomocysteineState = createFeatureSelector<fromBloodHomocysteine.BloodHomocysteineState>('blood-homocysteine');

export const getBloodHomocysteine = createSelector(
  selectBloodHomocysteineState,
  fromBloodHomocysteine.getBloodHomocysteine
);

export const getBloodHomocysteineTrends = createSelector(
  selectBloodHomocysteineState,
  fromBloodHomocysteine.getBloodHomocysteineTrends
);

export const getIsPending = createSelector(
  selectBloodHomocysteineState,
  fromBloodHomocysteine.getIsPending
);

export * from './blood-homocysteine.reducer';
