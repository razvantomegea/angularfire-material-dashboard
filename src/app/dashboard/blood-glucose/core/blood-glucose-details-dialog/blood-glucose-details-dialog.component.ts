import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { BLOOD_GLUCOSE_DETAILS, StorageService } from 'app/core/services';
import { DynamicFormService } from 'app/core/services/dynamic-form.service';

import { BloodGlucose } from 'app/dashboard/blood-glucose/model';
import {
  DynamicFormConfig,
  DynamicFormFieldTypes,
  DynamicFormGroupConfig,
  DynamicFormInputConfig,
  DynamicFormTextareaConfig
} from 'app/shared/components/dynamic-form';

import { DialogClosed } from 'app/shared/mixins';

const BLOOD_GLUCOSE_FORM_CONFIG = <DynamicFormConfig[]>[
  <DynamicFormGroupConfig>{
    configs: <DynamicFormInputConfig[]>[
      {
        appearance: 'outline',
        formControlName: 'bedTime',
        fxFlex: { default: '100%' },
        inputType: 'number',
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
        type: DynamicFormFieldTypes.Input
      },
      {
        appearance: 'outline',
        formControlName: 'fasting',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Fasting',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Fasting is required',
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
  <DynamicFormGroupConfig>{
    configs: <DynamicFormInputConfig[]>[
      {
        appearance: 'outline',
        formControlName: 'postMeal',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Post-Meal',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Post-Meal is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      },
      {
        appearance: 'outline',
        formControlName: 'preMeal',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Pre-Meal',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Pre-Meal is required',
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
  {
    appearance: 'outline',
    formControlName: 'hbA1c',
    fxFlex: { default: '100%' },
    inputType: 'number',
    label: 'Glycated hemoglobin',
    state: {
      required: true
    },
    validations: [
      {
        message: 'Glycated hemoglobin is required',
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
    placeholder: 'Noticed something special (good or bad) about your blood glucose?',
    type: DynamicFormFieldTypes.Textarea
  }
];

interface FormValue {
  group1: {
    bedTime: string;
    fasting: string;
  };
  group2: {
    postMeal: string;
    preMeal: string;
  };
  hbA1c: string;
  notes: string;
}

export class BloodGlucoseDetailsDialogData {
  constructor(
    public isDirty: boolean,
    public bedTime: string,
    public fasting: string,
    public postMeal: string,
    public preMeal: string,
    public hbA1c: string,
    public notes: string
  ) {
  }
}

@Component({
  selector: 'app-blood-glucose-details-dialog',
  templateUrl: './blood-glucose-details-dialog.component.html',
  styleUrls: ['./blood-glucose-details-dialog.component.scss']
})
export class BloodGlucoseDetailsDialogComponent extends DialogClosed {
  public bloodGlucoseData: BloodGlucoseDetailsDialogData;
  public formClasses: string[] = ['form-dialog'];
  public formConfigs: DynamicFormConfig[] = [...BLOOD_GLUCOSE_FORM_CONFIG];
  public initialFormData: FormValue;
  private isDirty = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: BloodGlucose,
    private dynamicFormService: DynamicFormService,
    protected dialogRef: MatDialogRef<BloodGlucoseDetailsDialogComponent>,
    protected router: Router
  ) {
    super(dialogRef, router);
    this.initialFormData = this.dynamicFormService.mapConfigToValue(this.formConfigs, data);
    const { bedTime, fasting, preMeal, postMeal, hbA1c, notes } = data;
    this.bloodGlucoseData = StorageService.get(BLOOD_GLUCOSE_DETAILS) ||
      new BloodGlucoseDetailsDialogData(
        false,
        `${bedTime}`,
        `${fasting}`,
        `${preMeal}`,
        `${postMeal}`,
        `${hbA1c}`,
        notes
      );
  }

  public onFormValueChanges(changes: FormValue): void {
    this.isDirty = true;
    this.saveBloodGlucoseData(changes);
    StorageService.save(BLOOD_GLUCOSE_DETAILS, this.bloodGlucoseData);
  }

  public onSubmit(value: FormValue): void {
    this.saveBloodGlucoseData(value);
    StorageService.delete(BLOOD_GLUCOSE_DETAILS);
    this.dialogRef.close(this.bloodGlucoseData);
  }

  private saveBloodGlucoseData(formValue: FormValue): void {
    const { group1, group2, hbA1c, notes } = formValue;
    this.bloodGlucoseData = new BloodGlucoseDetailsDialogData(
      this.isDirty,
      group1.bedTime,
      group1.fasting,
      group2.preMeal,
      group2.postMeal,
      hbA1c,
      notes
    );
  }
}
