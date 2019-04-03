import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { BLOOD_PRESSURE_DETAILS, StorageService } from 'app/core/services';
import { DynamicFormService } from 'app/core/services/dynamic-form.service';

import { BloodPressure } from 'app/dashboard/blood-pressure/model';
import {
  DynamicFormConfig,
  DynamicFormFieldTypes,
  DynamicFormGroupConfig,
  DynamicFormInputConfig,
  DynamicFormTextareaConfig
} from 'app/shared/components/dynamic-form';

import { DialogClosed } from 'app/shared/mixins';

const BLOOD_PRESSURE_FORM_CONFIG = <DynamicFormConfig[]>[
  <DynamicFormGroupConfig>{
    configs: <DynamicFormInputConfig[]>[
      {
        appearance: 'outline',
        formControlName: 'diastolic',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Diastolic',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Diastolic is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      },
      {
        appearance: 'outline',
        formControlName: 'systolic',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Systolic',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Systolic is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      }
    ],
    formControlName: 'group1',
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
    placeholder: 'Noticed something special (good or bad) about your blood pressure?',
    type: DynamicFormFieldTypes.Textarea
  }
];

interface FormValue {
  group1: {
    diastolic: string;
    systolic: string;
  };
  notes: string;
}

export class BloodPressureDetailsDialogData {
  constructor(
    public isDirty: boolean,
    public diastolic: string,
    public systolic: string,
    public notes: string
  ) {
  }
}

@Component({
  selector: 'app-blood-pressure-details-dialog',
  templateUrl: './blood-pressure-details-dialog.component.html',
  styleUrls: ['./blood-pressure-details-dialog.component.scss']
})
export class BloodPressureDetailsDialogComponent extends DialogClosed {
  public bloodPressureData: BloodPressureDetailsDialogData;
  public formClasses: string[] = ['form-dialog'];
  public formConfigs: DynamicFormConfig[] = [...BLOOD_PRESSURE_FORM_CONFIG];
  public initialFormData: FormValue;
  private isDirty = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: BloodPressure,
    private dynamicFormService: DynamicFormService,
    protected dialogRef: MatDialogRef<BloodPressureDetailsDialogComponent>,
    protected router: Router
  ) {
    super(dialogRef, router);
    this.initialFormData = this.dynamicFormService.mapConfigToValue(this.formConfigs, data);
    const { diastolic, systolic, notes } = data;
    this.bloodPressureData = StorageService.get(BLOOD_PRESSURE_DETAILS) ||
      new BloodPressureDetailsDialogData(
        false,
        `${diastolic}`,
        `${systolic}`,
        notes
      );
  }

  public onFormValueChanges(changes: FormValue): void {
    this.isDirty = true;
    this.saveBloodPressureData(changes);
    StorageService.save(BLOOD_PRESSURE_DETAILS, this.bloodPressureData);
  }

  public onSubmit(value: FormValue): void {
    this.saveBloodPressureData(value);
    StorageService.delete(BLOOD_PRESSURE_DETAILS);
    this.dialogRef.close(this.bloodPressureData);
  }

  private saveBloodPressureData(formValue: FormValue): void {
    const { group1, notes } = formValue;
    this.bloodPressureData = new BloodPressureDetailsDialogData(
      this.isDirty,
      group1.diastolic,
      group1.systolic,
      notes
    );
  }
}
