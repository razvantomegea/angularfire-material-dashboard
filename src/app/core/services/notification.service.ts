import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { LoadingDialogComponent } from 'app/shared/components/loading-dialog/loading-dialog.component';
import { NotificationDialogComponent } from 'app/shared/components/notification-dialog/notification-dialog.component';

@Injectable()
export class NotificationService {
  private loadingDialog: MatDialogRef<LoadingDialogComponent>;
  private snackbarRef: MatSnackBarRef<SimpleSnackBar>;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  public closeLoading(): void {
    this.loadingDialog.close();
  }

  public showError(message: string, duration: number = 3000): void {
    if (!!message) {
      console.error(message);
      this.snackBar.open(message, 'GOT IT!', <MatSnackBarConfig>{
        duration,
        panelClass: 'snackbar--warn',
        extraClasses: ['snackbar--warn']
      });
    }
  }

  public showInfo(message: string, duration: number = 3000): void {
    if (!!message) {
      console.log(message);
      this.snackBar.open(message, 'GOT IT!', <MatSnackBarConfig>{
        duration,
        panelClass: 'snackbar--info',
        extraClasses: ['snackbar--info']
      });
    }
  }

  public showLoading(): void {
    this.loadingDialog = this.dialog.open(LoadingDialogComponent, {
      maxWidth: '256px', width: '256px'
    });
  }

  public showNotificationDialog(
    message: string,
    title: string,
    withConfirm?: boolean,
    actionBtnText?: string,
    actionBtnColor?: string
  ): MatDialogRef<NotificationDialogComponent> {
    if (!!message && !!title) {
      return this.dialog.open(NotificationDialogComponent, {
        data: {
          content: message, title, withConfirm, actionBtnText, actionBtnColor
        }, panelClass: 'notification-dialog'
      });
    }
  }

  public showSuccess(message: string, duration: number = 3000): void {
    if (message) {
      console.log(message);
      this.snackBar.open(message, 'GOT IT!', <MatSnackBarConfig>{
        duration,
        panelClass: 'snackbar--success',
        extraClasses: ['snackbar--success']
      });
    }
  }
}
