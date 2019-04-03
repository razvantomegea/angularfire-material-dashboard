import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Activity, Interval, Movement, Session, Workout } from 'app/dashboard/movement/model';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { DataService } from 'app/shared/mixins';
import { Observable, take } from 'app/shared/utils/rxjs-exports';

const SESSIONS_PATH = 'sessions';
const SESSIONS_LIST_PATH = 'list';

@Injectable({
  providedIn: 'root'
})
export class MovementService extends DataService<Movement> {
  constructor(protected afAuth: AngularFireAuth, protected afs: AngularFirestore) {
    super(afAuth, afs, 'movement');
  }

  /**
   * @desc Calculates total duration
   * @param {(Activity | Session | Workout)[]} activities
   * @returns {number}
   */
  public static calculateDuration(activities: (Activity | Session | Workout)[]): number {
    return activities.reduce((acc: number, curr: Activity | Session | Workout) => acc += +curr.duration, 0);
  }

  /**
   * @desc Calculates total energy expenditure
   * @param {(Activity | Session | Workout)[]} activities
   * @returns {number}
   */
  public static calculateEnergyExpenditure(activities: (Activity | Session | Workout)[]): number {
    return activities.reduce((acc: number, curr: Activity | Session | Workout) => acc += +curr.energyExpenditure, 0);
  }

  public static calculateWorkoutDuration(workout: Workout): number {
    return Math.round(workout.intervals.reduce((acc, curr: Interval) => (acc += (curr.duration + curr.rest) * curr.sets), 0) / 60);
  }

  public static calculateWorkoutMet(workout: Workout, weight: number): number {
    return workout.energyExpenditure / ((weight * workout.duration) / 60);
  }

  public deleteFavoriteSession(id: string): Promise<void> {
    return this.deleteCustomData(SESSIONS_PATH, SESSIONS_LIST_PATH, id);
  }

  public getFavoriteSessionsChanges(): Observable<Session[]> {
    return this.getQueriedCollectionChanges(SESSIONS_PATH, SESSIONS_LIST_PATH);
  }

  public async getMovement(): Promise<Movement> {
    return this.getMovementChanges().pipe(take(1)).toPromise();
  }

  public getMovementChanges(): Observable<Movement> {
    return this.subscribeToDataChanges();
  }

  public getMovementTrendsChanges(query: TrendsQuery): Observable<Movement[]> {
    return this.subscribeToTrendsChanges(query);
  }

  public queryFavoriteSessions(query: string): void {
    this.queryCollection(SESSIONS_PATH, query);
  }

  public queryMovementTrends(payload: TrendsQuery): void {
    return this.queryTrends(payload);
  }

  public saveFavoriteSession(session: Session): Promise<void> {
    return this.saveCustomData(SESSIONS_PATH, SESSIONS_LIST_PATH, session);
  }

  public async saveMovement(movement: Movement): Promise<Movement> {
    return this.saveData(movement);
  }
}
