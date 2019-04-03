import * as moment from 'moment';

import { HealthyHabitsLevel } from 'app/dashboard/healthy-habits/model';
import { CUSTOM_DATE_FORMAT } from '../material/material.module';

export class UserBio {
  constructor(
    public dateOfBirth: string | number,
    public gender: string,
    public goal: string,
    public level: HealthyHabitsLevel,
    public summary?: string,
    public motherHood?: string
  ) {
    if (typeof dateOfBirth !== 'string') {
      this.dateOfBirth = moment().subtract(dateOfBirth, 'years').format(CUSTOM_DATE_FORMAT.display.dateInput);
    }
  }

  public getAge(): number {
    return moment().diff(moment(this.dateOfBirth, CUSTOM_DATE_FORMAT.display.dateInput), 'years');
  }

  public getGender(): string {
    return `${this.gender.charAt(0).toUpperCase()}${this.gender.slice(1)}`;
  }
}
