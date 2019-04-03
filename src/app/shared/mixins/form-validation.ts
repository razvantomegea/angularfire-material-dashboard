import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { takeUntil } from 'app/shared/utils/rxjs-exports';

import { FormErrorMessage, FormValidationErrors } from '../models';
import { ComponentDestroyed } from './component-destroyed';
import { DialogClosed } from './dialog-closed';
import { FormErrorStateMatcher } from './form-error-state-matcher';

export class FormValidation extends ComponentDestroyed {
  protected readonly formErrorMatcher: FormErrorStateMatcher = new FormErrorStateMatcher();
  protected form: FormGroup;
  protected formErrors: FormValidationErrors;

  constructor() {
    super();
  }

  public getFormControl(key: string): AbstractControl | FormArray {
    const controlKeys: string[] = key.split('.');
    let control: AbstractControl | FormGroup | FormArray = null;
    controlKeys.forEach((controlKey: string) => {
      if (!control) {
        control = this.form.get(controlKey);
      } else {
        if (control instanceof FormArray) {
          (<FormArray>control).controls.forEach((c: FormGroup) => {
            if (c.controls.hasOwnProperty(controlKey)) {
              control = c.get(controlKey);
            }
          });
        } else if (control instanceof FormGroup) {
          control = control.get(controlKey);
        }
      }
    });

    return control;
  }

  public hasError(formControlName: string, error: FormErrorMessage): boolean {
    const control: AbstractControl = this.form.get(formControlName);
    return formControlName === error.errorName && control.hasError(error.errorValidation);
  }

  public onFormValueChanges(changes: any): void {
    this.validateForm(this.form);
  }

  public onSubmit(): void {
    this.validateForm(this.form);
  }

  public setupFormValidation(form: FormGroup, formErrors: FormValidationErrors): void {
    this.form = form;
    this.formErrors = formErrors;

    this.form.valueChanges.pipe(takeUntil(this.isDestroyed$)).subscribe((changes: any) => {
      this.onFormValueChanges(changes);
    });
  }

  public validateForm(form: FormGroup): void {
    Object.keys(form.controls).forEach((key: string) => {
      const control: AbstractControl = form.get(key);
      if (control instanceof FormGroup) {
        this.validateForm(control);
      } else if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }
}

export class FormValidationComponent extends ComponentDestroyed {
  protected readonly formErrorMatcher: FormErrorStateMatcher = new FormErrorStateMatcher();
  protected form: FormGroup;
  protected formErrors: FormValidationErrors;

  constructor() {
    super();
  }

  protected hasError(formControlName: string, error: FormErrorMessage): boolean {
    return FormValidation.prototype.hasError.call(this, formControlName, error);
  }

  protected onFormValueChanges(changes: any): void {
    FormValidation.prototype.onFormValueChanges.call(this, changes);
  }

  protected onSubmit(): void {
    FormValidation.prototype.onSubmit.call(this);
  }

  protected setupFormValidation(form: FormGroup, formErrors: FormValidationErrors): void {
    FormValidation.prototype.setupFormValidation.call(this, form, formErrors);
  }

  protected validateForm(form: FormGroup): void {
    FormValidation.prototype.validateForm.call(this, form);
  }

  private getFormControl(key: string): AbstractControl | FormArray {
    return FormValidation.prototype.getFormControl.call(this, key);
  }
}

export class DialogFormValidation extends DialogClosed {
  protected readonly formErrorMatcher: FormErrorStateMatcher = new FormErrorStateMatcher();
  protected form: FormGroup;
  protected formErrors: FormValidationErrors;

  constructor(protected dialogRef: MatDialogRef<any>, protected router: Router) {
    super(dialogRef, router);
  }

  protected hasError(formControlName: string, error: FormErrorMessage): boolean {
    return FormValidation.prototype.hasError.call(this, formControlName, error);
  }

  protected onFormValueChanges(changes: any): void {
    FormValidation.prototype.onFormValueChanges.call(this, changes);
  }

  protected onSubmit(): void {
    FormValidation.prototype.onSubmit.call(this);
  }

  protected setupFormValidation(form: FormGroup, formErrors: FormValidationErrors): void {
    FormValidation.prototype.setupFormValidation.call(this, form, formErrors);
  }

  protected validateForm(form: FormGroup): void {
    FormValidation.prototype.validateForm.call(this, form);
  }

  private getFormControl(key: string): AbstractControl | FormArray {
    return FormValidation.prototype.getFormControl.call(this, key);
  }
}
