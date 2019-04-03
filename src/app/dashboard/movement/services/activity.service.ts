import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BodyComposition } from 'app/dashboard/body-composition/model';
import { BodyCompositionService } from 'app/dashboard/body-composition/services';
import { Activity, ActivityQuery } from 'app/dashboard/movement/model';
import { BehaviorSubject, map, Observable, of, switchMap } from 'app/shared/utils/rxjs-exports';

const ACTIVITIES_PATH = '/api/activities.json';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activities: Activity[];
  private activityQuerySubject$: BehaviorSubject<ActivityQuery>;
  private weight: number;

  constructor(private bodyCompositionService: BodyCompositionService, private http: HttpClient) {
  }

  public async calculateActivityEnergyExpenditure(activity: Activity): Promise<number> {
    if (!this.weight) {
      const bodyComposition: BodyComposition = await this.bodyCompositionService.getBodyComposition();

      if (!bodyComposition || !bodyComposition.measurements) {
        return 1;
      }

      this.weight = bodyComposition.measurements.weight;
    }

    return Math.round((+activity.met * this.weight * activity.duration) / 60);
  }

  public getActivitiesChanges(activityQuery: ActivityQuery): Observable<Activity[]> {
    this.activityQuerySubject$ = new BehaviorSubject(activityQuery);

    return this.activityQuerySubject$.pipe(switchMap((query: ActivityQuery) => {
      if (!this.activities) {
        return this.http.get(ACTIVITIES_PATH)
          .pipe(map((activities: Activity[]) => {
            if (activities) {
              this.activities = activities.map((activity: Activity) => ({
                ...activity,
                name: `${activity.category}, ${activity.name}`
              }));

              return this.getFilteredActivities(query);
            }

            return activities;
          }));
      }

      return of(this.activities.filter((activity: Activity) => activity.name.toLowerCase().includes(query.query)).slice(
        query.offset,
        query.offset + query.limit
      ));
    }));
  }

  public queryActivities(query: ActivityQuery): void {
    this.activityQuerySubject$.next(query);
  }

  private getFilteredActivities(query: ActivityQuery): Activity[] {
    return this.activities.filter((activity: Activity) => activity[query.prop] ? activity[query.prop].toLowerCase()
      .includes(query.query.toLowerCase()) : false).slice(
      query.offset,
      query.offset + query.limit
    );
  }
}
