import { CURRENT } from 'app/shared/mixins';
import { Tracker } from 'app/shared/models';

export class Sleep extends Tracker {
  constructor(
    public bedTime: string = '22:00',
    public fallAsleepDuration: number = 0,
    public wakeupTime: string = '06:00',
    public duration: number = 0,
    public notes?: string,
    public id?: string,
    public timestamp: string = CURRENT
  ) {
    super(timestamp, notes, id);
  }
}
