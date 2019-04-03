import { CURRENT } from 'app/shared/mixins';

export class Tracker {
  constructor(public timestamp: string = CURRENT, public notes?: string, public id?: string) {
  }
}
