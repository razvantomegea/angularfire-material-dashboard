import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { PhoneCredentials } from 'app/admin/model';
import { AuthService } from 'app/admin/services';
import { FirebaseStorageService, UserService } from 'app/core/services';
import { UserInfo } from 'app/shared/models';
import { catchError, concatMap, exhaustMap, from, map, mergeMap, Observable, of, tap } from 'app/shared/utils/rxjs-exports';
import { FirebaseError } from 'firebase/app';
import { LogError } from '../../app.actions';
import { State } from '../../app.reducers';
import { ToggleLoading } from '../../layout/actions/app.actions';
import {
  DeleteAccount,
  DeleteAccountSuccess,
  LinkProvider,
  ResetPhoneNumber,
  ResetPhoneNumberSuccess,
  SaveUserInfo,
  SaveUserInfoSuccess,
  UnlinkProvider,
  UserActionTypes
} from '../actions/user.actions';

@Injectable()
export class UserEffects {
  @Effect() public deleteAccount$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionTypes.DeleteAccount),
    map((action: DeleteAccount) => action.payload),
    concatMap((userInfo: UserInfo) => from(Promise.all([
        this.firebaseStorageService.clearStorage(userInfo.uid),
        this.userService.deleteUserInfo(),
        this.authService.deleteAccount()
      ])).pipe(
      map(() => new DeleteAccountSuccess()),
      catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error)))
      )
    )
  );

  @Effect() public linkProvider$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionTypes.LinkProvider),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: LinkProvider) => action.payload),
    exhaustMap((providerId: string) => from(this.authService.linkProvider(providerId)).pipe(
      mergeMap((user: UserInfo) => [new DeleteAccountSuccess(), new SaveUserInfo(user), new ToggleLoading(false)]),
      catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error)))
      )
    )
  );

  @Effect() public query$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionTypes.GetUserChanges),
    exhaustMap(() => this.userService.getUserChanges()),
    map((user: UserInfo) => new SaveUserInfoSuccess(user)),
    catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error)))
  );

  @Effect() public resetPhoneNumber$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionTypes.ResetPhoneNumber),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: ResetPhoneNumber) => action.payload),
    exhaustMap((credentials: PhoneCredentials) => from(this.authService.phoneNumberReset(credentials)).pipe(
      mergeMap((user: UserInfo) => [new ResetPhoneNumberSuccess(), new SaveUserInfo(user), new ToggleLoading(false)]),
      catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error)))
      )
    )
  );

  @Effect() public saveUserInfo$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionTypes.SaveUserInfo),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: SaveUserInfo) => action.payload),
    exhaustMap((user: UserInfo) => from(this.userService.saveUserInfo(user))
      .pipe(
        mergeMap((ui: UserInfo) => [new SaveUserInfoSuccess(ui), new ToggleLoading(false)]),
        catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error)))
      ))
  );

  @Effect() public unlinkProvider$: Observable<Action> = this.actions$.pipe(
    ofType(UserActionTypes.UnlinkProvider),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: UnlinkProvider) => action.payload),
    exhaustMap((providerId: string) => from(this.authService.unlinkProvider(providerId)).pipe(
      mergeMap((user: UserInfo) => [new DeleteAccountSuccess(), new SaveUserInfo(user), new ToggleLoading(false)]),
      catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error)))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private firebaseStorageService: FirebaseStorageService,
    private router: Router,
    private store$: Store<State>,
    private userService: UserService
  ) {
  }
}
