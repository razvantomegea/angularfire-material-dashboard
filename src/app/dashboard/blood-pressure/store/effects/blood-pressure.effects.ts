import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { FirebaseError } from 'firebase/app';

import { LogError } from 'app/core/store/app.actions';
import { State } from 'app/core/store/app.reducers';
import { ToggleLoading } from 'app/core/store/layout/actions/app.actions';
import { BloodPressureService } from 'app/dashboard/blood-pressure/services/blood-pressure.service';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { catchError, exhaustMap, from, map, Observable, of, tap } from 'app/shared/utils/rxjs-exports';
import { BloodPressure } from '../../model';
import {
  BloodPressureActionTypes,
  GetBloodPressureChangesFailure,
  GetBloodPressureTrends,
  GetBloodPressureTrendsFailure,
  GetBloodPressureTrendsSuccess,
  QueryTrends,
  SaveBloodPressure,
  SaveBloodPressureFailure,
  SaveBloodPressureSuccess
} from '../actions/blood-pressure.actions';

@Injectable()
export class BloodPressureEffects {
  @Effect() public getBloodPressureChanges$: Observable<Action> = this.actions$.pipe(
    ofType(BloodPressureActionTypes.GetBloodPressureChanges),
    exhaustMap(() => this.bloodPressureService.getBloodPressureChanges()),
    map((bloodPressure: BloodPressure) => new SaveBloodPressureSuccess(bloodPressure)),
    catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error), new GetBloodPressureChangesFailure()))
  );

  @Effect() public getTrends$: Observable<Action> = this.actions$.pipe(
    ofType(BloodPressureActionTypes.GetBloodPressureTrends),
    map((action: GetBloodPressureTrends) => action.payload),
    exhaustMap((query: TrendsQuery) => this.bloodPressureService.getBloodPressureTrendsChanges(query)),
    map((trends: BloodPressure[]) => new GetBloodPressureTrendsSuccess(trends)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetBloodPressureTrendsFailure()))
  );

  @Effect({ dispatch: false }) public queryTrends$: Observable<any> = this.actions$.pipe(
    ofType(BloodPressureActionTypes.QueryTrends),
    tap((action: QueryTrends) => this.bloodPressureService.queryBloodPressureTrends(action.payload)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetBloodPressureTrendsFailure()))
  );

  @Effect() public saveBloodPressure$: Observable<Action> = this.actions$.pipe(
    ofType(BloodPressureActionTypes.SaveBloodPressure),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: SaveBloodPressure) => action.payload),
    exhaustMap((bloodPressure: BloodPressure) => from(this.bloodPressureService.saveBloodPressure(bloodPressure)).pipe(map(() =>
      new ToggleLoading(false)
    ), catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveBloodPressureFailure()))))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private bloodPressureService: BloodPressureService
  ) {
  }
}
