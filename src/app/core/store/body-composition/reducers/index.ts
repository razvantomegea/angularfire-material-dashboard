import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromBodyComposition from './body-composition.reducer';

export const selectBodyCompositionState = createFeatureSelector<fromBodyComposition.BodyCompositionState>('bodyComposition');

export const getBodyComposition = createSelector(
  selectBodyCompositionState,
  fromBodyComposition.getBodyComposition
);

export const getBodyCompositionTrends = createSelector(
  selectBodyCompositionState,
  fromBodyComposition.getBodyCompositionTrends
);

export const getIsPending = createSelector(
  selectBodyCompositionState,
  fromBodyComposition.getIsPending
);

export * from './body-composition.reducer';
