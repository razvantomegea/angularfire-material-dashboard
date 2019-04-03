import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { NotificationService } from 'app/core/services';

import { State } from 'app/core/store/app.reducers';
import * as fromLayout from 'app/core/store/layout/reducers';
import * as fromRouter from 'app/core/store/router/reducers';
import { ComponentDestroyed } from 'app/shared/mixins';
import { DialogInfo } from 'app/shared/models';
import { filter, Observable, take, takeUntil } from 'app/shared/utils/rxjs-exports';
import { FirebaseError } from 'firebase/app';
import { AuthInfo, Credentials, PhoneCredentials } from '../model';
import { AUTH_INFO_CODES } from '../services';
import {
  AuthWithFacebook,
  AuthWithGithub,
  AuthWithGoogle,
  AuthWithTwitter,
  Login,
  PasswordResetRequest,
  PhoneConfirm,
  Register
} from '../store/actions/admin.actions';
import { getAuthError, getAuthInfo, getPhoneVerification } from '../store/reducers';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent extends ComponentDestroyed implements OnInit {
  public authCredentials: Credentials | PhoneCredentials;
  public authFormDisabled = false;
  public authMethod = 'registration';
  public particleConfig: object = {};
  public particleContainerHeight = 100;
  public particleContainerWidth = 100;
  public particleStyle: object = {};

  private readonly authError$: Observable<FirebaseError | TypeError | Error | SyntaxError> = this.store.pipe(select(
    getAuthError), takeUntil(this.isDestroyed$));
  private readonly authInfo$: Observable<AuthInfo | DialogInfo> = this.store.pipe(select(getAuthInfo), takeUntil(this.isDestroyed$));
  private readonly authPhoneVerification$: Observable<string> = this.store.pipe(select(getPhoneVerification), takeUntil(this.isDestroyed$));
  private readonly isLoading$: Observable<number> = this.store.pipe(select(fromLayout.getHasOverlay), takeUntil(this.isDestroyed$));
  private readonly routerState$: Observable<RouterReducerState<fromRouter.RouterStateUrl>> = this.store.pipe(select(
    fromRouter.getRouterState), takeUntil(this.isDestroyed$));
  private history: string;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private store: Store<State>
  ) {
    super();
  }

  public ngOnInit(): void {
    this.setupParticlesBackground();
    this.subscribeToStore();
  }

  public onFormError(err: FirebaseError | TypeError | Error | SyntaxError): void {
    this.notificationService.showError(err.message || err.toString());
  }

  public onReAuth(authMethod: string): void {
    if (this.history) {
      this.router.navigate([this.history]);
    } else {
      this.authMethod = authMethod;
    }
  }

  public onSocialAuth(authMethod: string): void {
    switch (authMethod) {
      case 'facebook':
        this.store.dispatch(new AuthWithFacebook());
        break;

      case 'github':
        this.store.dispatch(new AuthWithGithub());
        break;

      case 'google':
        this.store.dispatch(new AuthWithGoogle());
        break;

      case 'twitter':
        this.store.dispatch(new AuthWithTwitter());
        break;

      default:
        break;
    }
  }

  public onSubmit(submitEvent: { credentials: Credentials | PhoneCredentials; type: string; }): void {
    switch (submitEvent.type) {
      case 'registration':
        this.store.dispatch(new Register(<Credentials>submitEvent.credentials));
        break;

      case 'login':
        this.store.dispatch(new Login(<Credentials>submitEvent.credentials));
        break;

      case 'password-reset':
        this.store.dispatch(new PasswordResetRequest(<Credentials>submitEvent.credentials));
        break;

      case 'phone-number':
        this.notificationService.showNotificationDialog(
          'A verification code was sent by SMS to your phone number. Enter the received code to complete the' +
          ' two-step verification',
          'Confirm phone number'
        );
        break;

      // FIXME: Confirm must be pressed twice
      // FIXME: Progress bar not stopping after login/phone confirm
      case 'phone-confirm':
        this.store.dispatch(new PhoneConfirm(<PhoneCredentials>submitEvent.credentials));
        break;

      default:
        break;
    }
  }

  private handleConfirmationDialog(info: AuthInfo): void {
    switch (info.code) {
      case AUTH_INFO_CODES.EMAIL_PASSWORD_LINK:
        this.authMethod = 'login';
        this.authCredentials = new Credentials(info.extras.email);
        break;

      case AUTH_INFO_CODES.FACEBOOK_LINK:
        this.onSocialAuth('facebook');
        break;

      case AUTH_INFO_CODES.GITHUB_LINK:
        this.onSocialAuth('github');
        break;

      case AUTH_INFO_CODES.GOOGLE_LINK:
        this.onSocialAuth('google');
        break;

      case AUTH_INFO_CODES.TWITTER_LINK:
        this.onSocialAuth('twitter');
        break;

      case AUTH_INFO_CODES.PHONE_LINK:
        this.authMethod = 'phone';
        this.authCredentials = new Credentials(info.extras.phoneNumber);
        break;

      case AUTH_INFO_CODES.PHONE_IN_USE:
        this.authMethod = 'login';
        break;
    }
  }

  private handleRouterStateChange(routerState: RouterReducerState<fromRouter.RouterStateUrl>): void {
    const { credentials, method, history } = routerState.state.queryParams;

    if (credentials) {
      this.authCredentials = JSON.parse(credentials);
    }

    if (method) {
      this.authMethod = method;
    }

    this.history = history;
  }

  private setupParticlesBackground(): void {
    this.particleStyle = {
      position: 'fixed', width: '100%', height: '100%', 'z-index': -1, top: 0, left: 0, right: 0, bottom: 0
    };

    this.particleConfig = {
      particles: {
        number: {
          value: 100, density: {
            enable: true, value_area: 1000
          }
        }, color: {
          value: '#ffffff'
        }, shape: {
          type: 'circle', stroke: {
            width: 0, color: '#000000'
          }, polygon: {
            nb_sides: 5
          }, image: {
            src: 'img/github.svg', width: 100, height: 100
          }
        }, opacity: {
          value: 0.5, random: false, anim: {
            enable: false, speed: 1, opacity_min: 0.1, sync: false
          }
        }, size: {
          value: 3, random: true, anim: {
            enable: true, speed: 40, size_min: 0.1, sync: false
          }
        }, line_linked: {
          enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1
        }, move: {
          enable: true,
          speed: 6,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false, rotateX: 600, rotateY: 1200
          }
        }
      }, interactivity: {
        detect_on: 'canvas', events: {
          onhover: {
            enable: false, mode: 'repulse'
          }, onclick: {
            enable: false, mode: 'push'
          }, resize: true
        }, modes: {
          grab: {
            distance: 400, line_linked: {
              opacity: 1
            }
          }, bubble: {
            distance: 400, size: 40, duration: 2, opacity: 8, speed: 3
          }, repulse: {
            distance: 200, duration: 0.4
          }, push: {
            particles_nb: 4
          }, remove: {
            particles_nb: 2
          }
        }
      }, retina_detect: true
    };
  }

  private showConfirmDialog(info: AuthInfo): void {
    this.notificationService.showNotificationDialog(info.message, info.code, true)
      .afterClosed()
      .pipe(take(1))
      .toPromise()
      .then((confirm: boolean) => {
          if (confirm) {
            this.handleConfirmationDialog(info);
          }
        }
      );
  }

  private showNotificationDialog(info: DialogInfo): void {
    this.notificationService.showNotificationDialog(info.message, info.title)
      .afterClosed()
      .pipe(take(1))
      .toPromise()
      .then(() => {
        if (info.code === AUTH_INFO_CODES.PASSWORD_RESET) {
          this.authMethod = 'login';
        }
      });
  }

  private subscribeToStore(): void {
    this.authError$
      .pipe(filter((err: FirebaseError | TypeError | Error | SyntaxError) => !!err))
      .subscribe((err: FirebaseError | TypeError | Error | SyntaxError) => {
        this.notificationService.showError(err.message || err.toString());
      });
    this.authInfo$
      .pipe(filter((info: DialogInfo) => !!info))
      .subscribe((info: DialogInfo | AuthInfo) => {
        if (info instanceof DialogInfo) {
          this.showNotificationDialog(info);
        } else {
          this.showConfirmDialog(info);
        }
      });
    this.isLoading$.subscribe((isLoading: number) => {
      this.authFormDisabled = isLoading > 0;
    });
    this.authPhoneVerification$.subscribe((phoneNumber: string) => {
      if (typeof phoneNumber === 'string') {
        this.authCredentials = new PhoneCredentials('', phoneNumber, null);
        this.authMethod = 'phone-number';
      }
    });
    this.routerState$.subscribe((routerState: RouterReducerState<fromRouter.RouterStateUrl>) => {
      if (routerState) {
        this.handleRouterStateChange(routerState);
      }
    });
  }
}
