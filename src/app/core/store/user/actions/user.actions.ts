import { Action } from '@ngrx/store';

import { UserInfo } from 'app/shared/models';
import { PhoneCredentials } from 'app/admin/model';

export enum UserActionTypes {
  DeleteAccount = '[User] Delete Account',
  DeleteAccountSuccess = '[User] Delete Account Success',
  LinkProvider = '[User] Unlink Provider',
  LinkProviderSuccess = '[User] Link Provider Success',
  ResetPhoneNumber = '[User] Reset Phone Number',
  ResetPhoneNumberSuccess = '[User] Reset Phone Number Success',
  SaveUserInfo = '[User] Save User Info',
  SaveUserInfoSuccess = '[User] Save User Info Success',
  UnlinkProvider = '[User] Unlink Provider',
  UnlinkProviderSuccess = '[User] Unlink Provider Success',
  GetUserChanges = '[User] Get User Changes'
}

export class DeleteAccount implements Action {
  readonly type = UserActionTypes.DeleteAccount;

  constructor(public payload: UserInfo) {
  }
}

export class DeleteAccountSuccess implements Action {
  readonly type = UserActionTypes.DeleteAccountSuccess;

  constructor() {
  }
}

export class LinkProvider implements Action {
  readonly type = UserActionTypes.LinkProvider;

  constructor(public payload: string) {
  }
}

export class LinkProviderSuccess implements Action {
  readonly type = UserActionTypes.LinkProviderSuccess;

  constructor() {
  }
}

export class ResetPhoneNumber implements Action {
  readonly type = UserActionTypes.ResetPhoneNumber;

  constructor(public payload: PhoneCredentials) {
  }
}

export class ResetPhoneNumberSuccess implements Action {
  readonly type = UserActionTypes.ResetPhoneNumberSuccess;

  constructor() {
  }
}

export class SaveUserInfo implements Action {
  readonly type = UserActionTypes.SaveUserInfo;

  constructor(public payload: UserInfo) {
  }
}

export class SaveUserInfoSuccess implements Action {
  readonly type = UserActionTypes.SaveUserInfoSuccess;

  constructor(public payload: UserInfo) {
  }
}

export class UnlinkProvider implements Action {
  readonly type = UserActionTypes.UnlinkProvider;

  constructor(public payload: string) {
  }
}

export class UnlinkProviderSuccess implements Action {
  readonly type = UserActionTypes.UnlinkProviderSuccess;

  constructor() {
  }
}

export class GetUserChanges implements Action {
  readonly type = UserActionTypes.GetUserChanges;

  constructor() {
  }
}

export type UserActionsUnion =
  DeleteAccount
  | DeleteAccountSuccess
  | LinkProvider
  | LinkProviderSuccess
  | ResetPhoneNumber
  | ResetPhoneNumberSuccess
  | SaveUserInfo
  | SaveUserInfoSuccess
  | UnlinkProvider
  | UnlinkProviderSuccess
  | GetUserChanges;
