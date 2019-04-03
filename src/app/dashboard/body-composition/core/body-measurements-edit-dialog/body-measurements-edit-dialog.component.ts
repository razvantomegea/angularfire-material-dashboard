import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { BODY_MEASUREMENTS_DETAILS, StorageService } from 'app/core/services';
import { DynamicFormService } from 'app/core/services/dynamic-form.service';
import { BodyMeasurements } from 'app/dashboard/body-composition/model';

import {
  DynamicFormConfig,
  DynamicFormFieldTypes,
  DynamicFormGroupConfig,
  DynamicFormInputConfig,
  DynamicFormTextareaConfig
} from 'app/shared/components/dynamic-form';

import { DialogClosed } from 'app/shared/mixins';
import { MetricSystem } from 'app/shared/models';

const BODY_MEASUREMENTS_FORM_CONFIG = <DynamicFormConfig[]>[
  <DynamicFormGroupConfig>{
    configs: <DynamicFormInputConfig[]>[
      {
        appearance: 'outline',
        formControlName: 'height',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Height',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Height is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      },
      {
        appearance: 'outline',
        formControlName: 'weight',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Weight',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Weight is required',
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
        formControlName: 'chest',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Chest',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Chest is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      },
      {
        appearance: 'outline',
        formControlName: 'hips',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Hips',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Hips is required',
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
  <DynamicFormGroupConfig>{
    configs: <DynamicFormInputConfig[]>[
      {
        appearance: 'outline',
        formControlName: 'iliac',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Iliac',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Iliac is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      },
      {
        appearance: 'outline',
        formControlName: 'waist',
        fxFlex: { default: '100%' },
        inputType: 'number',
        label: 'Waist',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Waist is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      }
    ],
    formControlName: 'group3',
    fxLayout: { default: 'row', xs: 'column' },
    fxLayoutAlign: { default: 'space-between center' },
    fxLayoutGap: { default: '10px', xs: '0px' },
    type: DynamicFormFieldTypes.FormGroup
  },
  {
    appearance: 'outline',
    formControlName: 'heartRate',
    fxFlex: { default: '100%' },
    inputType: 'number',
    label: 'Heart Rate',
    suffix: 'bpm',
    state: {
      required: true
    },
    validations: [
      {
        message: 'Heart Rate is required',
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
    placeholder: 'Noticed something special (good or bad) about your body?',
    type: DynamicFormFieldTypes.Textarea
  }
];

interface FormValue {
  group1: {
    height: string;
    weight: string;
  };
  group2: {
    chest: string;
    hips: string;
  };
  group3: {
    waist: string;
    iliac: string;
  };
  heartRate: string;
  notes: string;
}

export class BodyMeasurementsEditDialogData {
  constructor(
    public isDirty: boolean,
    public height: string,
    public weight: string,
    public chest: string,
    public hips: string,
    public iliac: string,
    public waist: string,
    public heartRate: string,
    public notes: string
  ) {
  }
}

@Component({
  selector: 'app-body-measurements-edit-dialog',
  templateUrl: './body-measurements-edit-dialog.component.html',
  styleUrls: ['./body-measurements-edit-dialog.component.scss']
})
export class BodyMeasurementsEditDialogComponent extends DialogClosed {
  public bodyMeasurementsData: BodyMeasurementsEditDialogData;
  public formClasses: string[] = ['form-dialog'];
  public formConfigs: DynamicFormConfig[];
  public initialFormData: FormValue;
  private isDirty = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { measurements: BodyMeasurements, metricSystem: MetricSystem, heartRate: number },
    private dynamicFormService: DynamicFormService,
    protected dialogRef: MatDialogRef<BodyMeasurementsEditDialogComponent>,
    protected router: Router
  ) {
    super(dialogRef, router);
    const { measurements, heartRate, metricSystem } = data;
    this.formConfigs = [
      ...BODY_MEASUREMENTS_FORM_CONFIG.map((c: DynamicFormGroupConfig) => {
        if (c.configs) {
          c.configs.forEach((conf: DynamicFormInputConfig) => {
            conf.suffix = conf.formControlName === 'weight' ? metricSystem.mass : metricSystem.length;
          });
        }

        return c;
      })
    ];
    this.initialFormData = this.dynamicFormService.mapConfigToValue(this.formConfigs, { ...measurements, heartRate });
    this.bodyMeasurementsData = StorageService.get(BODY_MEASUREMENTS_DETAILS) ||
      new BodyMeasurementsEditDialogData(
        false,
        `${measurements.height}`,
        `${measurements.weight}`,
        `${measurements.chest}`,
        `${measurements.hips}`,
        `${measurements.iliac}`,
        `${measurements.waist}`,
        `${heartRate}`,
        measurements.notes
      );
  }

  public onFormValueChanges(changes: FormValue): void {
    this.isDirty = true;
    this.saveBodyMeasurementsData(changes);
    StorageService.save(BODY_MEASUREMENTS_DETAILS, this.bodyMeasurementsData);
  }

  public onSubmit(value: FormValue): void {
    this.saveBodyMeasurementsData(value);
    StorageService.delete(BODY_MEASUREMENTS_DETAILS);
    this.dialogRef.close(this.bodyMeasurementsData);
  }

  private saveBodyMeasurementsData(formValue: FormValue): void {
    const { group1, group2, group3, heartRate, notes } = formValue;
    this.bodyMeasurementsData = new BodyMeasurementsEditDialogData(
      this.isDirty,
      group1.height,
      group1.weight,
      group2.chest,
      group2.hips,
      group3.iliac,
      group3.waist,
      heartRate,
      notes
    );
  }
}
