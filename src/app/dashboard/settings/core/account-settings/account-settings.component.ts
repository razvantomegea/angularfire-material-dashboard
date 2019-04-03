import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { UserInfo as FirebaseUserInfo } from 'firebase/app';

import { PhoneCredentials } from 'app/admin/model';
import { PROVIDER_IDS } from 'app/admin/services';
import { NotificationService } from 'app/core/services';
import { UserInfo } from 'app/shared/models';
import { take } from 'app/shared/utils/rxjs-exports';
import { EmailEditDialogComponent } from '../email-edit-dialog/email-edit-dialog.component';
import { PhoneEditDialogComponent } from '../phone-edit-dialog/phone-edit-dialog.component';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnChanges {
  public providerIds = PROVIDER_IDS;
  @Input() public userInfo: UserInfo;
  @Output() private readonly deleteAccount: EventEmitter<void> = new EventEmitter();
  @Output() private readonly emailChange: EventEmitter<UserInfo> = new EventEmitter();
  @Output() private readonly passwordChange: EventEmitter<void> = new EventEmitter();
  @Output() private readonly phoneChange: EventEmitter<PhoneCredentials> = new EventEmitter();
  @Output() private readonly providerChange: EventEmitter<{ providerId: string, link?: boolean }> = new EventEmitter();
  private authProviders: FirebaseUserInfo[];

  constructor(private dialog: MatDialog, private notificationService: NotificationService) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.userInfo && changes.userInfo.currentValue) {
      this.authProviders = this.userInfo.providerData ? [...this.userInfo.providerData] : [];
    }
  }

  public isLinked(providerId: string): boolean {
    return !!this.authProviders.find((provider: FirebaseUserInfo) => provider.providerId === providerId);
  }

  public onChangeEmail(): void {
    this.dialog.open(EmailEditDialogComponent, {
      closeOnNavigation: true, data: this.userInfo.email, disableClose: true, width: '400px'
    }).afterClosed().pipe(take(1)).toPromise().then((email: string) => {
      if (email && this.userInfo.email !== email) {
        this.userInfo.email = email;
        this.emailChange.emit(<UserInfo>{ ...this.userInfo, email });
      }
    });
  }

  public onChangePassword(): void {
    this.passwordChange.emit();
  }

  public onChangePhoneNumber(): void {
    this.dialog.open(PhoneEditDialogComponent, {
      closeOnNavigation: true, data: this.userInfo.phoneNumber, disableClose: true, maxWidth: '600px'
    }).afterClosed().pipe(take(1)).toPromise().then((credentials: PhoneCredentials) => {
      if (credentials) {
        this.phoneChange.emit(credentials);
      }
    });
  }

  public onDeleteAccount(): void {
    this.notificationService.showNotificationDialog(
      'This operation is irreversible and will erase all your data. Are you sure you want do proceed?',
      'Delete account',
      true,
      'DELETE',
      'warn'
    ).afterClosed().pipe(take(1)).toPromise().then((confirmed: boolean) => {
      if (confirmed) {
        this.deleteAccount.emit();
      }
    });
  }

  public onLinkToggle(providerId: string): void {
    const provider: FirebaseUserInfo = this.authProviders.find((p: FirebaseUserInfo) => p.providerId ===
      providerId);
    this.providerChange.emit(provider ? {
      providerId: provider.providerId
    } : {
      providerId,
      link: true
    });
  }

}
