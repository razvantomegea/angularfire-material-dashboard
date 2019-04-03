import { CURRENT } from 'app/shared/mixins';
import { Tracker } from 'app/shared/models';

export class BloodKetones extends Tracker {
  constructor(
    public units: number = 0,
    public notes?: string,
    public id?: string,
    public timestamp: string = CURRENT
  ) {
    super(notes, id, timestamp);
  }
}
