import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromLayout from './layout.reducer';

export const selectLayoutState = createFeatureSelector<fromLayout.LayoutState>('layout');

export const getHasOverlay = createSelector(
  selectLayoutState,
  fromLayout.getHasOverlay
);

export const getTheme = createSelector(
  selectLayoutState,
  fromLayout.getTheme
);

export * from './layout.reducer';
