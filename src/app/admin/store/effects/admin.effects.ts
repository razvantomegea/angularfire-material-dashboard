import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { LogError } from 'app/core/store/app.actions';
import { State } from 'app/core/store/app.reducers';
import { ToggleLoading } from 'app/core/store/layout/actions/app.actions';
import { SaveUserInfo } from 'app/core/store/user/actions/user.actions';
import { DialogInfo, UserInfo } from 'app/shared/models';
import { catchError, exhaustMap, from, map, mergeMap, Observable, of, tap, withLatestFrom } from 'app/shared/utils/rxjs-exports';
import { FirebaseError } from 'firebase/app';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthInfo, Credentials, PhoneCredentials } from '../../model';
import { AUTH_INFO_CODES, AuthService } from '../../services';
import {
  AdminActionTypes,
  AuthFailure,
  AuthHandleErrorFailure,
  AuthHandleErrorSuccess,
  AuthSuccess,
  Login,
  PasswordResetRequest,
  PasswordResetRequestSuccess,
  PhoneConfirm,
  PhoneVerification,
  Register
} from '../actions/admin.actions';

@Injectable()
export class AdminEffects {
  @Effect() public authFailure$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActionTypes.AuthFailure),
    map((action: AuthFailure) => action.payload),
    exhaustMap((err: FirebaseError) => from(this.authService.handleAuthError(err))
      .pipe(mergeMap((res: any) => {
        const actions: Action[] = [new ToggleLoading(false)];

        if (res instanceof AuthInfo) {
          return [...actions, new AuthHandleErrorSuccess(res)];
        } else if (res instanceof UserInfo) {
          return [...actions, new AuthSuccess()];
        } else {
          return [...actions, new AuthHandleErrorFailure(res)];
        }
      }), catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error)))))
  );

  @Effect({ dispatch: false }) public authSuccess$: Observable<string> = this.actions$.pipe(
    ofType(AdminActionTypes.AuthSuccess),
    withLatestFrom(this.store$),
    map(([_, state]) => state.admin.redirectUrl),
    tap((redirectUrl: string) => this.router.navigate([redirectUrl]))
  );

  @Effect() public authWithFacebook$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActionTypes.AuthWithFacebook),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    exhaustMap(() => from(this.authService.authWithFacebook())
      .pipe(
        map((user: UserInfo) => new PhoneVerification(user.phoneNumber || '')),
        catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new AuthFailure(error)))
      ))
  );

  @Effect() public authWithGithub$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActionTypes.AuthWithGithub),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    exhaustMap(() => from(this.authService.authWithGithub())
      .pipe(
        map((user: UserInfo) => new PhoneVerification(user.phoneNumber || '')),
        catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new AuthFailure(error)))
      ))
  );

  @Effect() public authWithGoogle$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActionTypes.AuthWithGoogle),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    exhaustMap(() => from(this.authService.authWithGoogle())
      .pipe(
        map((user: UserInfo) => new PhoneVerification(user.phoneNumber || '')),
        catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new AuthFailure(error)))
      ))
  );

  @Effect() public authWithTwitter$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActionTypes.AuthWithTwitter),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    exhaustMap(() => from(this.authService.authWithTwitter())
      .pipe(
        map((user: UserInfo) => new PhoneVerification(user.phoneNumber || '')),
        catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new AuthFailure(error)))
      ))
  );

  @Effect() public login$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActionTypes.Login),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: Login) => action.payload),
    exhaustMap((credentials: Credentials) => from(this.authService.login(credentials))
      .pipe(
        map((user: UserInfo) => new PhoneVerification(user.phoneNumber || '')),
        catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new AuthFailure(error)))
      ))
  );

  @Effect() public passwordResetRequest$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActionTypes.PasswordResetRequest),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: PasswordResetRequest) => action.payload),
    exhaustMap((credentials: Credentials) => from(this.authService.passwordReset(credentials))
      .pipe(mergeMap(() => [
        new PasswordResetRequestSuccess(new DialogInfo(
          `An email with a password reset link has been sent.
        Go to your email inbox, follow the instructions, and change the password of your account.`,
          'Request sent',
          AUTH_INFO_CODES.PASSWORD_RESET
        )), new ToggleLoading(false)
      ]), catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new AuthFailure(error)))))
  );

  @Effect() public phoneConfirm$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActionTypes.PhoneConfirm),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: PhoneConfirm) => action.payload),
    exhaustMap((credentials: PhoneCredentials) => from(this.authService.linkPhone(credentials))
      .pipe(mergeMap((user: UserInfo) => [
        new SaveUserInfo(user), new AuthSuccess(), new ToggleLoading(false)
      ]), catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new AuthFailure(error)))))
  );

  @Effect({ dispatch: false }) public phoneVerification$: Observable<string | PhoneVerification> = this.actions$.pipe(
    ofType(AdminActionTypes.PhoneVerification),
    map((action: PhoneVerification) => action.payload),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(false));
    })
  );

  @Effect() public register$: Observable<Action> = this.actions$.pipe(
    ofType(AdminActionTypes.Register),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: Register) => action.payload),
    exhaustMap((credentials: Credentials) => from(this.authService.register(credentials))
      .pipe(
        map((user: UserInfo) => new PhoneVerification(user.phoneNumber)),
        catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new AuthFailure(error)))
      ))
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private loadingBar: LoadingBarService,
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private store$: Store<State>
  ) {
  }
}
