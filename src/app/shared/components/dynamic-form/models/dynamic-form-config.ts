import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DynamicFormFieldTypes } from 'app/shared/components/dynamic-form/models/dynamic-form-field-types.enum';

export interface DynamicFormConfig {
  appearance?: string; // Form field appearance
  classes?: string[]; // CSS classes
  conditionalShow?: any; // Condition to show/hide the component
  formControlName: string; // Form control name
  fxFlex?: FlexboxConfig; // Angular FlexLayout fxFlex attribute
  fxLayout?: FlexboxConfig; // Angular FlexLayout fxLayout attribute
  fxLayoutAlign?: FlexboxConfig; // Angular FlexLayout fxLayoutAlign attribute
  fxLayoutGap?: FlexboxConfig; // Angular FlexLayout fxLayoutGap attribute
  id?: string | number; // Unique identifier
  label?: string; // Form field label (MatLabel)
  name?: string; // Form control name
  placeholder?: string; // Form field placeholder
  prefix?: string; // Form field prefix
  suffix?: string; // Form field suffix
  state?: DynamicFormState; // Form field state
  type: DynamicFormFieldTypes; // Dynamic form component (Must exist in DynamicFormFieldTypes)
  validations?: DynamicFormValidation[]; // Form control validations
  value?: any; // Form control value
}

export interface DynamicFormValidation {
  expression?: any; // Validator function value (if needed)
  message: string; // Validation error message
  name: string; // Validator function name
  func?: ValidatorFn; // Validation function
}

export interface DynamicFormState {
  disabled?: boolean; // Is form control disabled
  required?: boolean; // Is form control required
}

export interface FlexboxConfig {
  default: string; // Default flexbox value
  lg?: string; // Large screen flexbox value
  md?: string; // Medium screen flexbox value
  sm?: string; // Small screen flexbox value
  xs?: string; // Extra-small screen flexbox value
}
