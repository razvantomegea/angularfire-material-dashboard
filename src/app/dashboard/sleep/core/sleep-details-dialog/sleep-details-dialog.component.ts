import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { SLEEP_DETAILS, StorageService } from 'app/core/services';
import { DynamicFormService } from 'app/core/services/dynamic-form.service';
import { Sleep } from 'app/dashboard/sleep/model';
import {
  DynamicFormConfig,
  DynamicFormFieldTypes,
  DynamicFormGroupConfig,
  DynamicFormInputConfig,
  DynamicFormTextareaConfig
} from 'app/shared/components/dynamic-form';
import { DialogClosed } from 'app/shared/mixins';

const SLEEP_FORM_CONFIG = <DynamicFormConfig[]>[
  <DynamicFormGroupConfig>{
    configs: <DynamicFormInputConfig[]>[
      {
        appearance: 'outline',
        formControlName: 'bedTime',
        fxFlex: { default: '100%' },
        label: 'Bed time',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Bed time is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Timepicker
      },
      {
        appearance: 'outline',
        formControlName: 'wakeupTime',
        fxFlex: { default: '100%' },
        label: 'Wake up time',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Wake up time is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Timepicker
      }
    ],
    formControlName: 'group1',
    fxLayout: { default: 'row', xs: 'column' },
    fxLayoutAlign: { default: 'space-between center' },
    fxLayoutGap: { default: '10px', xs: '0px' },
    type: DynamicFormFieldTypes.FormGroup
  },
  <DynamicFormGroupConfig>{
    configs: <DynamicFormInputConfig[]>[
      {
        appearance: 'outline',
        formControlName: 'fallAsleepDuration',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Fall asleep duration',
        placeholder: 'Minutes',
        suffix: 'min',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Fall asleep duration is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      },
      {
        appearance: 'outline',
        formControlName: 'duration',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Duration',
        placeholder: 'Hours',
        suffix: 'h',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Duration is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      }
    ],
    formControlName: 'group2',
    fxLayout: { default: 'row', xs: 'column' },
    fxLayoutAlign: { default: 'space-between center' },
    fxLayoutGap: { default: '10px', xs: '0px' },
    type: DynamicFormFieldTypes.FormGroup
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
    placeholder: 'Noticed something special (good or bad) about your sleep?',
    type: DynamicFormFieldTypes.Textarea
  }
];

interface FormValue {
  group1: {
    bedTime: string;
    wakeupTime: string;
  };
  group2: {
    fallAsleepDuration: string;
    duration: string;
  };
  notes: string;
}

export class SleepDetailsDialogData {
  constructor(
    public isDirty: boolean,
    public bedTime: string,
    public fallAsleepDuration: string,
    public wakeupTime: string,
    public duration: string,
    public notes: string,
    public timestamp: string
  ) {
  }
}

@Component({
  selector: 'app-sleep-details-dialog-component',
  templateUrl: './sleep-details-dialog.component.html',
  styleUrls: ['./sleep-details-dialog.component.scss']
})
export class SleepDetailsDialogComponent extends DialogClosed {
  public formClasses: string[] = ['form-dialog'];
  public formConfigs: DynamicFormConfig[] = [...SLEEP_FORM_CONFIG];
  public initialFormData: FormValue;
  public sleepData: SleepDetailsDialogData;
  public sleepDetailsForm: FormGroup = new FormGroup({});
  private isDirty = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Sleep,
    protected dialogRef: MatDialogRef<SleepDetailsDialogComponent>,
    private dynamicFormService: DynamicFormService,
    protected router: Router
  ) {
    super(dialogRef, router);
    this.initialFormData = this.dynamicFormService.mapConfigToValue(this.formConfigs, data);
    const { wakeupTime, fallAsleepDuration, bedTime, duration, timestamp, notes } = data;
    this.sleepData = StorageService.get(SLEEP_DETAILS) ||
      new SleepDetailsDialogData(
        false,
        bedTime,
        `${fallAsleepDuration}`,
        wakeupTime,
        `${duration}`,
        notes,
        timestamp
      );
  }

  public onFormCreated(form: FormGroup): void {
    this.sleepDetailsForm = form;
  }

  public onFormValueChanges(changes: FormValue): void {
    this.isDirty = true;

    const { group1, group2, notes } = changes;
    this.sleepData = new SleepDetailsDialogData(
      this.isDirty,
      group1.bedTime,
      `${group2.fallAsleepDuration}`,
      group1.wakeupTime,
      `${group2.duration}`,
      notes,
      this.sleepData.timestamp
    );
    StorageService.save(SLEEP_DETAILS, this.sleepData);
  }

  public onSubmit(value: FormValue, isNextStep?: boolean): void {
    if (!isNextStep) {
      StorageService.delete(SLEEP_DETAILS);
      this.dialogRef.close(this.sleepData);
    }
  }

}
