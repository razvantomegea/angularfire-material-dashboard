import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { MetricSystem, UserInfo } from 'app/shared/models';
import { take } from 'app/shared/utils/rxjs-exports';
import { ProfileEditDialogComponent } from '../profile-edit-dialog/profile-edit-dialog.component';

interface ProfileEditDialogResult {
  isDirty: boolean;
  profile: UserInfo;
}

@Component({
  selector: 'app-user-profile-settings',
  templateUrl: './user-profile-settings.component.html',
  styleUrls: ['./user-profile-settings.component.scss']
})
export class UserProfileSettingsComponent {
  public isOverflown = false;
  @Input() public userInfo: UserInfo;
  @Output() private readonly update: EventEmitter<UserInfo> = new EventEmitter();
  @Input() private metricSystem: MetricSystem;

  constructor(private dialog: MatDialog) {
  }

  public onMouseEnter(event: Event): void {
    const nodeEl: HTMLElement = <HTMLElement>event.target;
    this.isOverflown = nodeEl.scrollWidth > nodeEl.offsetWidth || nodeEl.scrollHeight > nodeEl.offsetHeight;
  }

  public onProfileUpdate(): void {
    this.dialog.open(ProfileEditDialogComponent, {
      closeOnNavigation: true, data: {
        metricSystem: this.metricSystem, profile: this.userInfo
      }, disableClose: true, maxWidth: '600px'
    }).afterClosed().pipe(take(1)).toPromise().then((data: ProfileEditDialogResult) => {
      if (data && data.isDirty) {
        this.update.emit(data.profile);
      }
    });
  }

}
