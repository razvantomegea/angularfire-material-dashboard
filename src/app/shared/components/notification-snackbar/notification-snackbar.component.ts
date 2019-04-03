import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatDialogRef, MatSnackBarRef } from '@angular/material';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-notification-snackbar',
  templateUrl: './notification-snackbar.component.html',
  styleUrls: ['./notification-snackbar.component.scss']
})
export class NotificationSnackbarComponent {
  public readonly message: string;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) private data: { message: string, type: string },
    private snackBarRef: MatSnackBarRef<NotificationSnackbarComponent>
  ) {
    this.message = data.message;
  }

  public getTypeError(): boolean {
    return this.data.type === 'error';
  }

  public getTypeInfo(): boolean {
    return this.data.type === 'info';
  }

  public getTypeSuccess(): boolean {
    return this.data.type === 'success';
  }

  public onDismiss(): void {
    this.snackBarRef.dismiss();
  }

}
