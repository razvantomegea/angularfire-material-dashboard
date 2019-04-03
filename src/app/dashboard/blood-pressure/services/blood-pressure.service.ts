import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { BloodPressure } from 'app/dashboard/blood-pressure/model';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { DataService } from 'app/shared/mixins';
import { Observable, take } from 'app/shared/utils/rxjs-exports';

@Injectable({
  providedIn: 'root'
})
export class BloodPressureService extends DataService<BloodPressure> {
  constructor(protected afAuth: AngularFireAuth, protected afs: AngularFirestore) {
    super(afAuth, afs, 'blood-pressure');
  }

  /**
   * @desc Gets the ideal blood pressure by age
   * https://www.vivehealth.com/blogs/resources/understanding-blood-pressure
   * @param {number} age
   * @return {BloodPressure}
   */
  public static getIdealBloodPressure(age: number): BloodPressure {
    if (age < 1) {
      return new BloodPressure(70, 100);
    }

    if (age <= 5) {
      return new BloodPressure(80, 110);
    }

    if (age <= 12) {
      return new BloodPressure(80, 120);
    }

    if (age <= 18) {
      return new BloodPressure(90, 140);
    }

    return new BloodPressure(90, 130);
  }

  public async getBloodPressure(): Promise<BloodPressure> {
    return this.getBloodPressureChanges().pipe(take(1)).toPromise();
  }

  public getBloodPressureChanges(): Observable<BloodPressure> {
    return this.subscribeToDataChanges();
  }

  public getBloodPressureTrendsChanges(query: TrendsQuery): Observable<BloodPressure[]> {
    return this.subscribeToTrendsChanges(query);
  }

  public queryBloodPressureTrends(payload: TrendsQuery): void {
    return this.queryTrends(payload);
  }

  public async saveBloodPressure(bloodPressure: BloodPressure): Promise<BloodPressure> {
    return this.saveData(bloodPressure);
  }
}
