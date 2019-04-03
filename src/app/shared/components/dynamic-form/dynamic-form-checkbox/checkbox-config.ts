import { DynamicFormConfig, DynamicFormState } from '../models';

export interface CheckboxConfig extends DynamicFormConfig {
  state: CheckboxState;
}

export interface CheckboxState extends DynamicFormState {
  checked?: boolean;
  indeterminate: boolean;
}
