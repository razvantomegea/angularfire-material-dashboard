import { DynamicFormConfig } from '../models';

export interface DynamicFormGroupConfig extends DynamicFormConfig {
  configs: DynamicFormConfig[];
}
