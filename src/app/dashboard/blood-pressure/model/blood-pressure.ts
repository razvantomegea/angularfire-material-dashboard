import { CURRENT } from 'app/shared/mixins';
import { Tracker } from 'app/shared/models';

export class BloodPressure extends Tracker {
  constructor(
    public diastolic: number = 0,
    public systolic: number = 0,
    public notes?: string,
    public id?: string,
    public timestamp: string = CURRENT
  ) {
    super(notes, id, timestamp);
  }
}
