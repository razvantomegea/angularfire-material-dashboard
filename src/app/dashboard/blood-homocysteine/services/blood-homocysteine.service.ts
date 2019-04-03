import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { BloodHomocysteine } from 'app/dashboard/blood-homocysteine/model';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { DataService } from 'app/shared/mixins';
import { Observable, take } from 'app/shared/utils/rxjs-exports';

@Injectable({
  providedIn: 'root'
})
export class BloodHomocysteineService extends DataService<BloodHomocysteine> {
  constructor(protected afAuth: AngularFireAuth, protected afs: AngularFirestore) {
    super(afAuth, afs, 'blood-homocysteine');
  }

  /**
   * @desc Gets the ideal blood homocysteine levels
   * https://drbenkim.com/articles-homocysteine.html
   * @return {BloodHomocysteine}
   */
  public static getIdealHomocysteine(): BloodHomocysteine {
    return new BloodHomocysteine(6);
  }

  public async getBloodHomocysteine(): Promise<BloodHomocysteine> {
    return this.getBloodHomocysteineChanges().pipe(take(1)).toPromise();
  }

  public getBloodHomocysteineChanges(): Observable<BloodHomocysteine> {
    return this.subscribeToDataChanges();
  }

  public getBloodHomocysteineTrendsChanges(query: TrendsQuery): Observable<BloodHomocysteine[]> {
    return this.subscribeToTrendsChanges(query);
  }

  public queryBloodHomocysteineTrends(payload: TrendsQuery): void {
    return this.queryTrends(payload);
  }

  public async saveBloodHomocysteine(bloodHomocysteine: BloodHomocysteine): Promise<BloodHomocysteine> {
    return this.saveData(bloodHomocysteine);
  }
}
