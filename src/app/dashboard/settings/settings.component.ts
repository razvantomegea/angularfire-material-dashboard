import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { Credentials, PhoneCredentials } from 'app/admin/model';
import { AuthService } from 'app/admin/services';
import { METRIC_SYSTEM, NotificationService, StorageService, UtilsService } from 'app/core/services';
import { State } from 'app/core/store/app.reducers';
import { ChangeTheme } from 'app/core/store/layout/actions/app.actions';
import * as fromLayout from 'app/core/store/layout/reducers';
import {
  DeleteAccount,
  GetUserChanges,
  LinkProvider,
  ResetPhoneNumber,
  SaveUserInfo,
  UnlinkProvider
} from 'app/core/store/user/actions/user.actions';
import * as fromUser from 'app/core/store/user/reducers';
import { ComponentDestroyed } from 'app/shared/mixins';
import { MetricSystem, UserInfo } from 'app/shared/models';
import { Observable, takeUntil } from 'app/shared/utils/rxjs-exports';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends ComponentDestroyed implements OnInit {
  public readonly theme$: Observable<string> = this.store.pipe(select(fromLayout.getTheme), takeUntil(this.isDestroyed$));
  public isSaving = false;
  public metricSystem: MetricSystem;
  public userInfo: UserInfo;
  private readonly userInfo$: Observable<UserInfo> = this.store.pipe(select(fromUser.getUser), takeUntil(this.isDestroyed$));
  private isDeletionPending = false;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router,
    private store: Store<State>
  ) {
    super();
    this.metricSystem = UtilsService.setupMetricSystem();
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetUserChanges());
    this.userInfo$.subscribe((userInfo: UserInfo) => {
      if (userInfo) {
        this.initUserInfo(userInfo);
      } else if (this.userInfo && this.isDeletionPending) {
        this.router.navigate(['/admin']);
        this.notificationService.showSuccess('Account successfully deleted!');
      }
    });
  }

  public onChangeEmail(userInfo: UserInfo): void {
    this.store.dispatch(new SaveUserInfo(userInfo));
    this.isSaving = true;
  }

  public onChangeMetricSystem(metricSystem: MetricSystem): void {
    this.metricSystem = metricSystem;
    StorageService.save(METRIC_SYSTEM, this.metricSystem);
  }

  // FIXME: Password reset and password login removes linked providers
  public onChangePassword(): void {
    /**
     this.authService.passwordReset(new Credentials(this.userInfo.email)).then(() => {
      this.notificationService.showInfo('Email successfully sent!');
    });
     */

    this.router.navigate(
      ['/admin'],
      {
        queryParams: {
          credentials: JSON.stringify(new Credentials(this.userInfo.email)),
          history: '/settings',
          method: 'password-reset'
        }
      }
    );
  }

  public onChangePhoneNumber(credentials: PhoneCredentials): void {
    this.isSaving = true;
    this.store.dispatch(new ResetPhoneNumber(credentials));
  }

  public onChangeTheme(theme: string): void {
    this.store.dispatch(new ChangeTheme(theme));
  }

  public onDeleteAccount(): void {
    this.isDeletionPending = true;
    this.store.dispatch(new DeleteAccount(this.userInfo));
  }

  public onProfileUpdate(userInfo: UserInfo): void {
    this.store.dispatch(new SaveUserInfo(userInfo));
    this.isSaving = true;
  }

  // FIXME: Error when linking/unlinking
  public onProviderChange(provider: { providerId: string, link?: boolean }): void {
    this.isSaving = true;

    if (!provider.link) {
      this.store.dispatch(new UnlinkProvider(provider.providerId));
    } else {
      this.store.dispatch(new LinkProvider(provider.providerId));
    }
  }

  private initUserInfo(userInfo: UserInfo): void {
    if (this.userInfo && this.isSaving) {
      this.isSaving = false;

      if (this.userInfo.isDifferentEmail(userInfo)) {
        this.notificationService.showSuccess('Email successfully updated!');
      } else if (this.userInfo.isDifferentPhoneNumber(userInfo)) {
        this.notificationService.showSuccess('Phone number successfully updated!');
      } else if (this.userInfo.isDifferentProfile(userInfo)) {
        this.notificationService.showSuccess('Profile successfully updated!');
      } else {
        const unLinkedProvider: string = this.userInfo.hasUnLinkedProvider(userInfo);
        const linkedProvider: string = this.userInfo.hasLinkedProvider(userInfo);

        if (unLinkedProvider) {
          this.notificationService.showInfo(`${unLinkedProvider} successfully unlinked!`);
        } else if (linkedProvider) {
          this.notificationService.showInfo(`${linkedProvider} successfully unlinked!`);
        }
      }
    }
    this.userInfo = userInfo;
  }

}
