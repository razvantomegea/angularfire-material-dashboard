import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromMovement from './movement.reducer';

export const selectMovementState = createFeatureSelector<fromMovement.MovementState>('movement');

export const getMovement = createSelector(
  selectMovementState,
  fromMovement.getMovement
);

export const getMovementTrends = createSelector(
  selectMovementState,
  fromMovement.getMovementTrends
);

export const getActivities = createSelector(
  selectMovementState,
  fromMovement.getActivities
);
export const getIsDirty = createSelector(
  selectMovementState,
  fromMovement.getIsDirty
);

export const getIsPending = createSelector(
  selectMovementState,
  fromMovement.getIsPending
);

export const getFavoriteSessions = createSelector(
  selectMovementState,
  fromMovement.getFavoriteSessions
);

export const getSelectedSession = createSelector(
  selectMovementState,
  fromMovement.getSelectedSession
);

export * from './movement.reducer';
