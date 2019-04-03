import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

interface NotificationDialogData {
  actionBtnColor: string;
  actionBtnText: string;
  content: string;
  title: string;
  withConfirm?: boolean;
}

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent {
  public actionBtnColor = 'accent';
  public actionBtnText = 'OK';
  public content: string;
  public title: string;
  public withConfirm: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: NotificationDialogData,
    private dialogRef: MatDialogRef<NotificationDialogComponent>
  ) {
    this.actionBtnColor = data.actionBtnColor || this.actionBtnColor;
    this.actionBtnText = data.actionBtnText || this.actionBtnText;
    this.content = data.content;
    this.title = data.title;
    this.withConfirm = data.withConfirm;
  }

  public onClose(): void {
    this.dialogRef.close();
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }
}
