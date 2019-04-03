import { Tracker } from 'app/shared/models';
import { Session } from './session';

export class Movement extends Tracker {
  constructor(
    public sessions: Session[] = [],
    public duration: number = 0,
    public energyExpenditure: number = 0
  ) {
    super();
  }

}
