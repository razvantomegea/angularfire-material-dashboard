import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { BloodGlucose } from 'app/dashboard/blood-glucose/model';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { DataService } from 'app/shared/mixins';
import { Observable, take } from 'app/shared/utils/rxjs-exports';

@Injectable({
  providedIn: 'root'
})
export class BloodGlucoseService extends DataService<BloodGlucose> {
  constructor(protected afAuth: AngularFireAuth, protected afs: AngularFirestore) {
    super(afAuth, afs, 'blood-glucose');
  }

  /**
   * @desc Gets the ideal blood homocysteine levels
   * https://www.joslin.org/info/goals_for_blood_glucose_control.html
   * https://en.wikipedia.org/wiki/Glycated_hemoglobin#Measuring_HbA1c
   * @param {string} unit
   * @return {BloodGlucose}
   */
  public static getIdealBloodGlucose(unit: string): BloodGlucose {
    if (unit === 'mg/dL') {
      return new BloodGlucose(105, 85, 125, 95, 5.3);
    } else {
      return new BloodGlucose(5.81, 4.7, 6.85, 5.26, 33);
    }
  }

  public async getBloodGlucose(): Promise<BloodGlucose> {
    return this.getBloodGlucoseChanges().pipe(take(1)).toPromise();
  }

  public getBloodGlucoseChanges(): Observable<BloodGlucose> {
    return this.subscribeToDataChanges();
  }

  public getBloodGlucoseTrendsChanges(query: TrendsQuery): Observable<BloodGlucose[]> {
    return this.subscribeToTrendsChanges(query);
  }

  public queryBloodGlucoseTrends(payload: TrendsQuery): void {
    return this.queryTrends(payload);
  }

  public async saveBloodGlucose(bloodGlucose: BloodGlucose): Promise<BloodGlucose> {
    return this.saveData(bloodGlucose);
  }
}
