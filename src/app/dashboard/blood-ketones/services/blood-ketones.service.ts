import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { BloodKetones } from 'app/dashboard/blood-ketones/model';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { DataService } from 'app/shared/mixins';
import { Observable, take } from 'app/shared/utils/rxjs-exports';

@Injectable({
  providedIn: 'root'
})
export class BloodKetonesService extends DataService<BloodKetones> {
  constructor(protected afAuth: AngularFireAuth, protected afs: AngularFirestore) {
    super(afAuth, afs, 'blood-ketones');
  }

  /**
   * @desc Gets the ideal blood ketones levels
   * https://ketosummit.com/optimal-ketone-levels-for-ketogenic-diet
   * @param {string} unit
   * @return {BloodPressure}
   */
  public static getIdealKetones(unit: string): BloodKetones {
    return new BloodKetones(0);
  }

  public async getBloodKetones(): Promise<BloodKetones> {
    return this.getBloodKetonesChanges().pipe(take(1)).toPromise();
  }

  public getBloodKetonesChanges(): Observable<BloodKetones> {
    return this.subscribeToDataChanges();
  }

  public getBloodKetonesTrendsChanges(query: TrendsQuery): Observable<BloodKetones[]> {
    return this.subscribeToTrendsChanges(query);
  }

  public queryBloodKetonesTrends(payload: TrendsQuery): void {
    return this.queryTrends(payload);
  }

  public async saveBloodKetones(bloodKetones: BloodKetones): Promise<BloodKetones> {
    return this.saveData(bloodKetones);
  }
}
