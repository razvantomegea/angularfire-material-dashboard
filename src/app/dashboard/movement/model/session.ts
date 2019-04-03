import { CUSTOM_TIME_FORMAT } from 'app/shared/material/material.module';
import { Tracker } from 'app/shared/models';
import * as moment from 'moment';
import { Activity } from './activity';

export class Session extends Tracker {
  constructor(
    public timestamp: string = moment().format(CUSTOM_TIME_FORMAT.display.timeInput),
    public name: string = '',
    public activities: Activity[] = [],
    public duration: number = 0,
    public energyExpenditure: number = 0,
    public notes?: string,
    public id?: string
  ) {
    super(timestamp, notes, id);
  }
}
