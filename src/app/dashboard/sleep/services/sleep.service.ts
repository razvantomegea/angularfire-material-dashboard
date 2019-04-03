import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { TrendsQuery } from 'app/dashboard/shared/model';
import { Sleep } from 'app/dashboard/sleep/model';
import { DataService } from 'app/shared/mixins';
import { ParseType, timeDifference, timeToNumber } from 'app/shared/utils/moment-helpers';
import { Observable, take } from 'app/shared/utils/rxjs-exports';

@Injectable({
  providedIn: 'root'
})
export class SleepService extends DataService<Sleep> {
  constructor(protected afAuth: AngularFireAuth, protected afs: AngularFirestore) {
    super(afAuth, afs, 'sleep');
  }

  public async getSleep(): Promise<Sleep> {
    return this.getSleepChanges().pipe(take(1)).toPromise();
  }

  public getSleepChanges(): Observable<Sleep> {
    return this.subscribeToDataChanges();
  }

  public getSleepTrendsChanges(query: TrendsQuery): Observable<Sleep[]> {
    return this.subscribeToTrendsChanges(query);
  }

  public querySleepTrends(payload: TrendsQuery): void {
    return this.queryTrends(payload);
  }

  public async saveSleep(sleep: Sleep): Promise<Sleep> {
    return this.saveData(sleep);
  }
}
