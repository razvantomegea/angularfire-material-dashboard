import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export class PromptDialogData {
  constructor(
    public inputLabel: string,
    public inputType: string,
    public inputValue: string | number,
    public message: string,
    public placeholder: string,
    public title: string
  ) {
  }
}

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent {
  public inputValue;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogData,
    private dialogRef: MatDialogRef<PromptDialogComponent>
  ) {
    this.inputValue = data.inputValue;
  }

  public onConfirm(): void {
    this.dialogRef.close(this.inputValue);
  }
}
