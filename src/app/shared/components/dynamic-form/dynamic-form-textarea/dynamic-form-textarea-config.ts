import { DynamicFormConfig } from '../models';

export interface DynamicFormTextareaConfig extends DynamicFormConfig {
  autosize: boolean;
  autosizeMaxRows: number;
  autosizeMinRows: number;
  hints: string[];
  maxLength: number;
}
