import { UserService } from 'app/core/services';
import { UserBio, UserInfo } from 'app/shared/models';

import { UserActionsUnion, UserActionTypes } from '../actions/user.actions';

export function reducer(state, action: UserActionsUnion): UserInfo {
  switch (action.type) {
    case UserActionTypes.SaveUserInfoSuccess:
      return <UserInfo>action.payload;

    case UserActionTypes.DeleteAccountSuccess:
      return null;

    default:
      return state;
  }
}

export const getUser = (state: UserInfo) => UserService.mapUserInfo(state);

export const getUserLevel = (state: UserInfo) => state && state.bio ? state.bio.level : null;
