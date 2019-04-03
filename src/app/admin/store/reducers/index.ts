import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAdmin from './admin.reducer';

export const selectAdminState = createFeatureSelector<fromAdmin.AdminState>('admin');

export const getAuthError = createSelector(
  selectAdminState,
  fromAdmin.getAuthError
);

export const getAuthInfo = createSelector(
  selectAdminState,
  fromAdmin.getAuthInfo
);

export const getPhoneVerification = createSelector(
  selectAdminState,
  fromAdmin.getPhoneVerification
);

export * from './admin.reducer';
