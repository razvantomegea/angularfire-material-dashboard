import * as moment from 'moment';
import { DynamicFormConfig } from '../models';

export interface DynamicFormDatepickerConfig extends DynamicFormConfig {
  maxDate: moment.Moment;
  minDate: moment.Moment;
  value: string;
}
