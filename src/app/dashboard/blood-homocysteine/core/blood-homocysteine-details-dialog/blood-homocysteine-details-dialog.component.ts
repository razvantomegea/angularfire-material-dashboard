import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { BLOOD_HOMOCYSTEINE_DETAILS, StorageService } from 'app/core/services';
import { DynamicFormService } from 'app/core/services/dynamic-form.service';

import { BloodHomocysteine } from 'app/dashboard/blood-homocysteine/model';
import { DynamicFormConfig, DynamicFormFieldTypes, DynamicFormTextareaConfig } from 'app/shared/components/dynamic-form';

import { DialogClosed } from 'app/shared/mixins';

const BLOOD_HOMOCYSTEINE_FORM_CONFIG = <DynamicFormConfig[]>[
  {
    appearance: 'outline',
    formControlName: 'units',
    fxFlex: { default: '100%' },
    inputType: 'number',
    label: 'Units',
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
    placeholder: 'Noticed something special (good or bad) about your blood homocysteine?',
    type: DynamicFormFieldTypes.Textarea
  }
];

interface FormValue {
  notes: string;
  units: string;
}

export class BloodHomocysteineDetailsDialogData {
  constructor(
    public isDirty: boolean,
    public units: string,
    public notes: string
  ) {
  }
}

@Component({
  selector: 'app-blood-homocysteine-details-dialog',
  templateUrl: './blood-homocysteine-details-dialog.component.html',
  styleUrls: ['./blood-homocysteine-details-dialog.component.scss']
})
export class BloodHomocysteineDetailsDialogComponent extends DialogClosed {
  public bloodHomocysteineData: BloodHomocysteineDetailsDialogData;
  public formClasses: string[] = ['form-dialog'];
  public formConfigs: DynamicFormConfig[] = [...BLOOD_HOMOCYSTEINE_FORM_CONFIG];
  public initialFormData: FormValue;
  private isDirty = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: BloodHomocysteine,
    private dynamicFormService: DynamicFormService,
    protected dialogRef: MatDialogRef<BloodHomocysteineDetailsDialogComponent>,
    protected router: Router
  ) {
    super(dialogRef, router);
    this.initialFormData = this.dynamicFormService.mapConfigToValue(this.formConfigs, data);
    const { units, notes } = data;
    this.bloodHomocysteineData = StorageService.get(BLOOD_HOMOCYSTEINE_DETAILS) ||
      new BloodHomocysteineDetailsDialogData(
        false,
        `${units}`,
        notes
      );
  }

  public onFormValueChanges(changes: FormValue): void {
    this.isDirty = true;
    this.saveBloodHomocysteineData(changes);
    StorageService.save(BLOOD_HOMOCYSTEINE_DETAILS, this.bloodHomocysteineData);
  }

  public onSubmit(value: FormValue): void {
    this.saveBloodHomocysteineData(value);
    StorageService.delete(BLOOD_HOMOCYSTEINE_DETAILS);
    this.dialogRef.close(this.bloodHomocysteineData);
  }

  private saveBloodHomocysteineData(formValue: FormValue): void {
    const { units, notes } = formValue;
    this.bloodHomocysteineData = new BloodHomocysteineDetailsDialogData(
      this.isDirty,
      units,
      notes
    );
  }
}
