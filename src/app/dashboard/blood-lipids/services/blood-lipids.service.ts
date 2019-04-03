import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { BloodLipids } from 'app/dashboard/blood-lipids/model';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { DataService } from 'app/shared/mixins';
import { Observable, take } from 'app/shared/utils/rxjs-exports';

@Injectable({
  providedIn: 'root'
})
export class BloodLipidsService extends DataService<BloodLipids> {
  constructor(protected afAuth: AngularFireAuth, protected afs: AngularFirestore) {
    super(afAuth, afs, 'blood-lipids');
  }

  /**
   * @desc Gets the ideal blood lipids
   * https://www.healthline.com/health/high-cholesterol/levels-by-age
   * @param {string} unit
   * @return {BloodLipids}
   */
  public static getIdealBloodLipids(unit: string): BloodLipids {
    if (unit === 'mg/dL') {
      return new BloodLipids(60, 80, 250, 130);
    } else {
      return new BloodLipids(1.5516, 2.0688, 5.172, 1.4677);
    }
  }

  public async getBloodLipids(): Promise<BloodLipids> {
    return this.getBloodLipidsChanges().pipe(take(1)).toPromise();
  }

  public getBloodLipidsChanges(): Observable<BloodLipids> {
    return this.subscribeToDataChanges();
  }

  public getBloodLipidsTrendsChanges(query: TrendsQuery): Observable<BloodLipids[]> {
    return this.subscribeToTrendsChanges(query);
  }

  public queryBloodLipidsTrends(payload: TrendsQuery): void {
    return this.queryTrends(payload);
  }

  public async saveBloodLipids(bloodLipids: BloodLipids): Promise<BloodLipids> {
    return this.saveData(bloodLipids);
  }
}
