import { CURRENT } from 'app/shared/mixins';
import { Tracker } from 'app/shared/models';

export class BloodGlucose extends Tracker {
  constructor(
    public bedTime: number = 0,
    public fasting: number = 0,
    public postMeal: number = 0,
    public preMeal: number = 0,
    public hbA1c: number = 0,
    public notes?: string,
    public id?: string,
    public timestamp: string = CURRENT
  ) {
    super(notes, id, timestamp);
  }
}
