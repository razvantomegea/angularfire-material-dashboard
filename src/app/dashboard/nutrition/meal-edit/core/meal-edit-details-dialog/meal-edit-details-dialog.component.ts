import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { MEAL_DETAILS, StorageService } from 'app/core/services';
import { DynamicFormService } from 'app/core/services/dynamic-form.service';
import { Meal } from 'app/dashboard/nutrition/model';
import { DynamicFormConfig, DynamicFormFieldTypes, DynamicFormTextareaConfig } from 'app/shared/components/dynamic-form';
import { DialogClosed } from 'app/shared/mixins';

const MEAL_FORM_CONFIG = <DynamicFormConfig[]>[
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
    placeholder: 'Noticed something special (good or bad) about this meal?',
    type: DynamicFormFieldTypes.Textarea
  }
];

interface FormValue {
  name: string;
  notes: string;
  timestamp: string;
}

export class MealEditDetailsDialogData {
  constructor(
    public isDirty: boolean,
    public timestamp: string,
    public name: string,
    public notes: string
  ) {
  }
}

@Component({
  selector: 'app-meal-edit-details-dialog',
  templateUrl: './meal-edit-details-dialog.component.html',
  styleUrls: ['./meal-edit-details-dialog.component.scss']
})
export class MealEditDetailsDialogComponent extends DialogClosed {
  public formClasses: string[] = ['form-dialog'];
  public formConfigs: DynamicFormConfig[] = [...MEAL_FORM_CONFIG];
  public initialFormData: FormValue;
  public mealData: MealEditDetailsDialogData;
  private isDirty = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Meal,
    private dynamicFormService: DynamicFormService,
    protected dialogRef: MatDialogRef<MealEditDetailsDialogComponent>,
    protected router: Router
  ) {
    super(dialogRef, router);
    this.initialFormData = this.dynamicFormService.mapConfigToValue(this.formConfigs, data);
    const { timestamp, name, notes } = data;
    this.mealData = StorageService.get(MEAL_DETAILS) ||
      new MealEditDetailsDialogData(
        false,
        timestamp,
        name,
        notes
      );
  }

  public onFormValueChanges(changes: FormValue): void {
    this.isDirty = true;
    this.saveMealData(changes);
    StorageService.save(MEAL_DETAILS, this.mealData);
  }

  public onSubmit(value: FormValue): void {
    this.saveMealData(value);
    StorageService.delete(MEAL_DETAILS);
    this.dialogRef.close(this.mealData);
  }

  private saveMealData(formValue: FormValue): void {
    const { timestamp, name, notes } = formValue;
    this.mealData = new MealEditDetailsDialogData(
      this.isDirty,
      timestamp,
      name,
      notes
    );
  }
}
