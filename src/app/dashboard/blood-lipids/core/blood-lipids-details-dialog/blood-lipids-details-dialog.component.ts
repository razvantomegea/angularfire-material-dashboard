import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { BLOOD_LIPIDS_DETAILS, StorageService } from 'app/core/services';
import { DynamicFormService } from 'app/core/services/dynamic-form.service';

import { BloodLipids } from 'app/dashboard/blood-lipids/model';
import {
  DynamicFormConfig,
  DynamicFormFieldTypes,
  DynamicFormGroupConfig,
  DynamicFormInputConfig,
  DynamicFormTextareaConfig
} from 'app/shared/components/dynamic-form';

import { DialogClosed } from 'app/shared/mixins';

const BLOOD_LIPIDS_FORM_CONFIG = <DynamicFormConfig[]>[
  <DynamicFormGroupConfig>{
    configs: <DynamicFormInputConfig[]>[
      {
        appearance: 'outline',
        formControlName: 'hdl',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'HDL',
        state: {
          required: true
        },
        validations: [
          {
            message: 'HDL is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      },
      {
        appearance: 'outline',
        formControlName: 'ldl',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'LDL',
        state: {
          required: true
        },
        validations: [
          {
            message: 'LDL is required',
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
        formControlName: 'triglycerides',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Triglycerides',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Triglycerides is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      },
      {
        appearance: 'outline',
        formControlName: 'total',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Total lipids',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Total lipids is required',
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
    placeholder: 'Noticed something special (good or bad) about your blood lipids?',
    type: DynamicFormFieldTypes.Textarea
  }
];

interface FormValue {
  group1: {
    hdl: string;
    ldl: string;
  };
  group2: {
    triglycerides: string;
    total: string;
  };
  notes: string;
}

export class BloodLipidsDetailsDialogData {
  constructor(
    public isDirty: boolean,
    public hdl: string,
    public ldl: string,
    public triglycerides: string,
    public total: string,
    public notes: string
  ) {
  }
}

@Component({
  selector: 'app-blood-lipids-details-dialog',
  templateUrl: './blood-lipids-details-dialog.component.html',
  styleUrls: ['./blood-lipids-details-dialog.component.scss']
})
export class BloodLipidsDetailsDialogComponent extends DialogClosed {
  public bloodLipidsData: BloodLipidsDetailsDialogData;
  public formClasses: string[] = ['form-dialog'];
  public formConfigs: DynamicFormConfig[] = [...BLOOD_LIPIDS_FORM_CONFIG];
  public initialFormData: FormValue;
  private isDirty = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: BloodLipids,
    private dynamicFormService: DynamicFormService,
    protected dialogRef: MatDialogRef<BloodLipidsDetailsDialogComponent>,
    protected router: Router
  ) {
    super(dialogRef, router);
    this.initialFormData = this.dynamicFormService.mapConfigToValue(this.formConfigs, data);
    const { hdl, ldl, total, triglycerides, notes } = data;
    this.bloodLipidsData = StorageService.get(BLOOD_LIPIDS_DETAILS) ||
      new BloodLipidsDetailsDialogData(
        false,
        `${hdl}`,
        `${ldl}`,
        `${triglycerides}`,
        `${total}`,
        notes
      );
  }

  public onFormValueChanges(changes: FormValue): void {
    this.isDirty = true;
    this.saveBloodLipidsData(changes);
    StorageService.save(BLOOD_LIPIDS_DETAILS, this.bloodLipidsData);
  }

  public onSubmit(value: FormValue): void {
    this.saveBloodLipidsData(value);
    StorageService.delete(BLOOD_LIPIDS_DETAILS);
    this.dialogRef.close(this.bloodLipidsData);
  }

  private saveBloodLipidsData(formValue: FormValue): void {
    const { group1, group2, notes } = formValue;
    this.bloodLipidsData = new BloodLipidsDetailsDialogData(
      this.isDirty,
      group1.hdl,
      group1.ldl,
      group2.triglycerides,
      group2.total,
      notes
    );
  }
}
