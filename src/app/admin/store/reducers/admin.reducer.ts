import { DialogInfo } from 'app/shared/models';
import { FirebaseError } from 'firebase/app';

import { AuthInfo } from '../../model';
import { AdminActionsUnion, AdminActionTypes } from '../actions/admin.actions';

export interface AdminState {
  authError: FirebaseError | TypeError | Error | SyntaxError;
  authInfo: AuthInfo | DialogInfo;
  phoneVerify: string;
  redirectUrl: string;
}

export const initialState: AdminState = {
  authError: null, authInfo: null, phoneVerify: null, redirectUrl: '/'
};

export function reducer(state = initialState, action: AdminActionsUnion): AdminState {
  switch (action.type) {
    case AdminActionTypes.AuthHandleErrorSuccess:
    case AdminActionTypes.PasswordResetRequestSuccess:
      return {
        ...state, authInfo: <AuthInfo>action.payload
      };

    case AdminActionTypes.AuthSuccess:
      return {
        ...state, phoneVerify: null
      };

    case AdminActionTypes.AuthRedirect:
      return {
        ...state, redirectUrl: <string>action.payload
      };

    case AdminActionTypes.AuthHandleErrorFailure:
      return {
        ...state, authError: <FirebaseError | TypeError | Error | SyntaxError>action.payload
      };

    case AdminActionTypes.PhoneVerification:
      return {
        ...state, phoneVerify: action.payload
      };

    default:
      return state;
  }
}

export const getAuthError = (state: AdminState) => state.authError;
export const getAuthInfo = (state: AdminState) => state.authInfo;
export const getPhoneVerification = (state: AdminState) => state.phoneVerify;
