import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { SESSION_DETAILS, StorageService } from 'app/core/services';
import { DynamicFormService } from 'app/core/services/dynamic-form.service';
import { Session } from 'app/dashboard/movement/model';
import { DynamicFormConfig, DynamicFormFieldTypes, DynamicFormTextareaConfig } from 'app/shared/components/dynamic-form';
import { DialogClosed } from 'app/shared/mixins';

const SESSION_FORM_CONFIG = <DynamicFormConfig[]>[
  {
    appearance: 'outline',
    formControlName: 'name',
    fxFlex: { default: '100%' },
    label: 'Time',
    state: {
      required: true
    },
    validations: [
      {
        message: 'Time is required',
        name: 'required'
      }
    ],
    type: DynamicFormFieldTypes.Timepicker
  },
  {
    appearance: 'outline',
    formControlName: 'name',
    fxFlex: { default: '100%' },
    inputType: 'text',
    label: 'Name',
    state: {
      required: true
    },
    validations: [
      {
        message: 'Name is required',
        name: 'required'
      }
    ],
    type: DynamicFormFieldTypes.Input
  },
  <DynamicFormTextareaConfig>{
    appearance: 'outline',
    autosize: true,
    autosizeMaxRows: 15,
    autosizeMinRows: 2,

    formControlName: 'notes',
    fxFlex: { default: '100%' },
    label: 'Notes',
    maxLength: 500,
    placeholder: 'Noticed something special (good or bad) about this session?',
    type: DynamicFormFieldTypes.Textarea
  }
];

interface FormValue {
  name: string;
  notes: string;
  timestamp: string;
}

export class SessionEditDetailsDialogData {
  constructor(
    public isDirty: boolean,
    public timestamp: string,
    public name: string,
    public notes: string
  ) {
  }
}

@Component({
  selector: 'app-session-edit-details-dialog',
  templateUrl: './session-edit-details-dialog.component.html',
  styleUrls: ['./session-edit-details-dialog.component.scss']
})
export class SessionEditDetailsDialogComponent extends DialogClosed {
  public formClasses: string[] = ['form-dialog'];
  public formConfigs: DynamicFormConfig[] = [...SESSION_FORM_CONFIG];
  public initialFormData: FormValue;
  public sessionData: SessionEditDetailsDialogData;
  private isDirty = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Session,
    private dynamicFormService: DynamicFormService,
    protected dialogRef: MatDialogRef<SessionEditDetailsDialogComponent>,
    protected router: Router
  ) {
    super(dialogRef, router);
    this.initialFormData = this.dynamicFormService.mapConfigToValue(this.formConfigs, data);
    const { timestamp, name, notes } = data;
    this.sessionData = StorageService.get(SESSION_DETAILS) ||
      new SessionEditDetailsDialogData(
        false,
        timestamp,
        name,
        notes
      );
  }

  public onFormValueChanges(changes: FormValue): void {
    this.isDirty = true;
    this.saveSessionData(changes);
    StorageService.save(SESSION_DETAILS, this.sessionData);
  }

  public onSubmit(value: FormValue): void {
    this.saveSessionData(value);
    StorageService.delete(SESSION_DETAILS);
    this.dialogRef.close(this.sessionData);
  }

  private saveSessionData(formValue: FormValue): void {
    const { timestamp, name, notes } = formValue;
    this.sessionData = new SessionEditDetailsDialogData(
      this.isDirty,
      timestamp,
      name,
      notes
    );
  }
}
