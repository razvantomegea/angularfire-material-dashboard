import { DynamicFormConfig } from 'app/shared/components/dynamic-form';

export interface DynamicFormSelectionListConfig extends DynamicFormConfig {
  options: SelectionListOption[];
  subheader: string;
  multiSelection: boolean;
}

export interface SelectionListOption {
  label: string;
  name: string;
  value: any;
}
