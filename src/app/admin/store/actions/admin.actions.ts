import { Action } from '@ngrx/store';

import { DialogInfo } from 'app/shared/models';
import { FirebaseError } from 'firebase/app';
import { AuthInfo, Credentials, PhoneCredentials } from '../../model';

export enum AdminActionTypes {
  AuthFailure = '[Admin] Auth Failure',
  AuthHandleErrorFailure = '[Admin] Auth Handle Error Failure',
  AuthHandleErrorSuccess = '[Admin] Auth Handle Error Success',
  AuthRedirect = '[Admin] Auth Redirect',
  AuthSuccess = '[Admin] Auth Success',
  AuthWithFacebook = '[Admin] Auth with Facebook',
  AuthWithGithub = '[Admin] Auth with Github',
  AuthWithGoogle = '[Admin] Auth with Google',
  AuthWithTwitter = '[Admin] Auth with Twitter',
  Login = '[Admin] Login',
  PasswordResetRequest = '[Admin] Password Reset Request',
  PasswordResetRequestSuccess = '[Admin] Password Reset Request Success',
  PhoneConfirm = '[Admin] Phone Verification Confirmation',
  PhoneVerification = '[Admin] Phone Verification',
  Register = '[Admin] Register'
}

export class AuthFailure implements Action {
  readonly type = AdminActionTypes.AuthFailure;

  constructor(public payload: FirebaseError | TypeError | Error | SyntaxError) {
  }
}

export class AuthHandleErrorFailure implements Action {
  readonly type = AdminActionTypes.AuthHandleErrorFailure;

  constructor(public payload: FirebaseError | TypeError | Error | SyntaxError) {
  }
}

export class AuthHandleErrorSuccess implements Action {
  readonly type = AdminActionTypes.AuthHandleErrorSuccess;

  constructor(public payload: AuthInfo) {
  }
}

export class AuthRedirect implements Action {
  readonly type = AdminActionTypes.AuthRedirect;

  constructor(public payload: string) {
  }
}

export class AuthSuccess implements Action {
  readonly type = AdminActionTypes.AuthSuccess;

  constructor() {
  }
}

export class AuthWithFacebook implements Action {
  readonly type = AdminActionTypes.AuthWithFacebook;

  constructor() {
  }
}

export class AuthWithGithub implements Action {
  readonly type = AdminActionTypes.AuthWithGithub;

  constructor() {
  }
}

export class AuthWithGoogle implements Action {
  readonly type = AdminActionTypes.AuthWithGoogle;

  constructor() {
  }
}

export class AuthWithTwitter implements Action {
  readonly type = AdminActionTypes.AuthWithTwitter;

  constructor() {
  }
}

export class Login implements Action {
  readonly type = AdminActionTypes.Login;

  constructor(public payload: Credentials) {
  }
}

export class PasswordResetRequest implements Action {
  readonly type = AdminActionTypes.PasswordResetRequest;

  constructor(public payload: Credentials) {
  }
}

export class PasswordResetRequestSuccess implements Action {
  readonly type = AdminActionTypes.PasswordResetRequestSuccess;

  constructor(public payload: DialogInfo) {
  }
}

export class PhoneConfirm implements Action {
  readonly type = AdminActionTypes.PhoneConfirm;

  constructor(public payload: PhoneCredentials) {
  }
}

export class PhoneVerification implements Action {
  readonly type = AdminActionTypes.PhoneVerification;

  constructor(public payload: string) {
  }
}

export class Register implements Action {
  readonly type = AdminActionTypes.Register;

  constructor(public payload: Credentials) {
  }
}

export type AdminActionsUnion =
  AuthFailure
  | AuthHandleErrorFailure
  | AuthHandleErrorSuccess
  | AuthRedirect
  | AuthSuccess
  | AuthWithFacebook
  | AuthWithGithub
  | AuthWithGoogle
  | AuthWithTwitter
  | Login
  | PasswordResetRequest
  | PasswordResetRequestSuccess
  | PhoneConfirm
  | PhoneVerification
  | Register;
