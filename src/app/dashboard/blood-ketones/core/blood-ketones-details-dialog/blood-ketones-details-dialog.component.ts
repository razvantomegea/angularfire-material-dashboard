import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { BLOOD_KETONES_DETAILS, StorageService } from 'app/core/services';
import { DynamicFormService } from 'app/core/services/dynamic-form.service';

import { BloodKetones } from 'app/dashboard/blood-ketones/model';
import { DynamicFormConfig, DynamicFormFieldTypes, DynamicFormTextareaConfig } from 'app/shared/components/dynamic-form';

import { DialogClosed } from 'app/shared/mixins';

const BLOOD_KETONES_FORM_CONFIG = <DynamicFormConfig[]>[
  {
    appearance: 'outline',
    formControlName: 'units',
    fxFlex: { default: '100%' },
    inputType: 'number',
    label: 'Glycated hemoglobin',
    state: {
      required: true
    },
    validations: [
      {
        message: 'Units is required',
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
    placeholder: 'Noticed something special (good or bad) about your blood ketones?',
    type: DynamicFormFieldTypes.Textarea
  }
];

interface FormValue {
  notes: string;
  units: string;
}

export class BloodKetonesDetailsDialogData {
  constructor(
    public isDirty: boolean,
    public units: string,
    public notes: string
  ) {
  }
}

@Component({
  selector: 'app-blood-ketones-details-dialog',
  templateUrl: './blood-ketones-details-dialog.component.html',
  styleUrls: ['./blood-ketones-details-dialog.component.scss']
})
export class BloodKetonesDetailsDialogComponent extends DialogClosed {
  public bloodKetonesData: BloodKetonesDetailsDialogData;
  public formClasses: string[] = ['form-dialog'];
  public formConfigs: DynamicFormConfig[] = [...BLOOD_KETONES_FORM_CONFIG];
  public initialFormData: FormValue;
  private isDirty = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: BloodKetones,
    private dynamicFormService: DynamicFormService,
    protected dialogRef: MatDialogRef<BloodKetonesDetailsDialogComponent>,
    protected router: Router
  ) {
    super(dialogRef, router);
    this.initialFormData = this.dynamicFormService.mapConfigToValue(this.formConfigs, data);
    const { units, notes } = data;
    this.bloodKetonesData = StorageService.get(BLOOD_KETONES_DETAILS) ||
      new BloodKetonesDetailsDialogData(
        false,
        `${units}`,
        notes
      );
  }

  public onFormValueChanges(changes: FormValue): void {
    this.isDirty = true;
    this.saveBloodKetonesData(changes);
    StorageService.save(BLOOD_KETONES_DETAILS, this.bloodKetonesData);
  }

  public onSubmit(value: FormValue): void {
    this.saveBloodKetonesData(value);
    StorageService.delete(BLOOD_KETONES_DETAILS);
    this.dialogRef.close(this.bloodKetonesData);
  }

  private saveBloodKetonesData(formValue: FormValue): void {
    const { units, notes } = formValue;
    this.bloodKetonesData = new BloodKetonesDetailsDialogData(
      this.isDirty,
      units,
      notes
    );
  }
}
