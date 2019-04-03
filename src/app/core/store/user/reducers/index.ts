import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserInfo } from 'app/shared/models';

import * as fromUser from './user.reducer';

export const selectUserState = createFeatureSelector<UserInfo>('user');

export const getUser = createSelector(
  selectUserState,
  fromUser.getUser
);

export const getUserLevel = createSelector(
  selectUserState,
  fromUser.getUserLevel
);

export * from './user.reducer';
