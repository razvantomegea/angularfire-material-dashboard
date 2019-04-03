import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { EMAIL_FORM_CONFIG } from 'app/admin/services';

import { DynamicFormService } from 'app/core/services/dynamic-form.service';
import { DynamicFormConfig } from 'app/shared/components/dynamic-form';
import { DialogClosed } from 'app/shared/mixins';

interface FormValue {
  email: string;
}

@Component({
  selector: 'app-email-edit-dialog',
  templateUrl: './email-edit-dialog.component.html',
  styleUrls: ['./email-edit-dialog.component.scss']
})
export class EmailEditDialogComponent extends DialogClosed {
  public formClasses: string[] = ['form-dialog'];
  public formConfigs: DynamicFormConfig[] = [EMAIL_FORM_CONFIG];
  public initialFormData: FormValue;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: string,
    private dynamicFormService: DynamicFormService,
    protected dialogRef: MatDialogRef<EmailEditDialogComponent>,
    protected router: Router
  ) {
    super(dialogRef, router);
    this.initialFormData = this.dynamicFormService.mapConfigToValue(this.formConfigs, data);
  }

  public onSubmit(value: FormValue): void {
    this.dialogRef.close(value.email);
  }
}
