import { CURRENT } from 'app/shared/mixins';
import { Tracker } from 'app/shared/models';

export class BloodLipids extends Tracker {
  constructor(
    public hdl: number = 0,
    public ldl: number = 0,
    public total: number = 0,
    public triglycerides: number = 0,
    public notes?: string,
    public id?: string,
    public timestamp: string = CURRENT
  ) {
    super(notes, id, timestamp);
  }
}
