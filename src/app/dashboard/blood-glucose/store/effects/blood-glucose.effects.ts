import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { LogError } from 'app/core/store/app.actions';
import { State } from 'app/core/store/app.reducers';
import { ToggleLoading } from 'app/core/store/layout/actions/app.actions';
import { BloodGlucoseService } from 'app/dashboard/blood-glucose/services/blood-glucose.service';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { catchError, exhaustMap, from, map, Observable, of, tap } from 'app/shared/utils/rxjs-exports';
import { FirebaseError } from 'firebase/app';
import { BloodGlucose } from '../../model';
import {
  BloodGlucoseActionTypes,
  GetBloodGlucoseChangesFailure,
  GetBloodGlucoseTrends,
  GetBloodGlucoseTrendsFailure,
  GetBloodGlucoseTrendsSuccess,
  QueryTrends,
  SaveBloodGlucose,
  SaveBloodGlucoseFailure,
  SaveBloodGlucoseSuccess
} from '../actions/blood-glucose.actions';

@Injectable()
export class BloodGlucoseEffects {
  @Effect() public getBloodGlucoseChanges$: Observable<Action> = this.actions$.pipe(
    ofType(BloodGlucoseActionTypes.GetBloodGlucoseChanges),
    exhaustMap(() => this.bloodGlucoseService.getBloodGlucoseChanges()),
    map((bloodGlucose: BloodGlucose) => new SaveBloodGlucoseSuccess(bloodGlucose)),
    catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error), new GetBloodGlucoseChangesFailure()))
  );

  @Effect() public getTrends$: Observable<Action> = this.actions$.pipe(
    ofType(BloodGlucoseActionTypes.GetBloodGlucoseTrends),
    map((action: GetBloodGlucoseTrends) => action.payload),
    exhaustMap((query: TrendsQuery) => this.bloodGlucoseService.getBloodGlucoseTrendsChanges(query)),
    map((trends: BloodGlucose[]) => new GetBloodGlucoseTrendsSuccess(trends)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetBloodGlucoseTrendsFailure()))
  );

  @Effect({ dispatch: false }) public queryTrends$: Observable<any> = this.actions$.pipe(
    ofType(BloodGlucoseActionTypes.QueryTrends),
    tap((action: QueryTrends) => this.bloodGlucoseService.queryBloodGlucoseTrends(action.payload)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetBloodGlucoseTrendsFailure()))
  );

  @Effect() public saveBloodGlucose$: Observable<Action> = this.actions$.pipe(
    ofType(BloodGlucoseActionTypes.SaveBloodGlucose),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: SaveBloodGlucose) => action.payload),
    exhaustMap((bloodGlucose: BloodGlucose) => from(this.bloodGlucoseService.saveBloodGlucose(bloodGlucose)).pipe(map(() =>
      new ToggleLoading(false)
    ), catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveBloodGlucoseFailure()))))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private bloodGlucoseService: BloodGlucoseService
  ) {
  }
}
