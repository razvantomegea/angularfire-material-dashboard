import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { FirebaseError } from 'firebase/app';

import { LogError } from 'app/core/store/app.actions';
import { State } from 'app/core/store/app.reducers';
import { ToggleLoading } from 'app/core/store/layout/actions/app.actions';
import { BloodKetonesService } from 'app/dashboard/blood-ketones/services/blood-ketones.service';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { catchError, exhaustMap, from, map, Observable, of, tap } from 'app/shared/utils/rxjs-exports';
import { BloodKetones } from '../../model';
import {
  BloodKetonesActionTypes,
  GetBloodKetonesChangesFailure,
  GetBloodKetonesTrends,
  GetBloodKetonesTrendsFailure,
  GetBloodKetonesTrendsSuccess,
  QueryTrends,
  SaveBloodKetones,
  SaveBloodKetonesFailure,
  SaveBloodKetonesSuccess
} from '../actions/blood-ketones.actions';

@Injectable()
export class BloodKetonesEffects {
  @Effect() public getBloodKetonesChanges$: Observable<Action> = this.actions$.pipe(
    ofType(BloodKetonesActionTypes.GetBloodKetonesChanges),
    exhaustMap(() => this.bloodKetonesService.getBloodKetonesChanges()),
    map((bloodKetones: BloodKetones) => new SaveBloodKetonesSuccess(bloodKetones)),
    catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(
      new LogError(error),
      new GetBloodKetonesChangesFailure()
    ))
  );

  @Effect() public getTrends$: Observable<Action> = this.actions$.pipe(
    ofType(BloodKetonesActionTypes.GetBloodKetonesTrends),
    map((action: GetBloodKetonesTrends) => action.payload),
    exhaustMap((query: TrendsQuery) => this.bloodKetonesService.getBloodKetonesTrendsChanges(query)),
    map((trends: BloodKetones[]) => new GetBloodKetonesTrendsSuccess(trends)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetBloodKetonesTrendsFailure()))
  );

  @Effect({ dispatch: false }) public queryTrends$: Observable<any> = this.actions$.pipe(
    ofType(BloodKetonesActionTypes.QueryTrends),
    tap((action: QueryTrends) => this.bloodKetonesService.queryBloodKetonesTrends(action.payload)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetBloodKetonesTrendsFailure()))
  );

  @Effect() public saveBloodKetones$: Observable<Action> = this.actions$.pipe(
    ofType(BloodKetonesActionTypes.SaveBloodKetones),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: SaveBloodKetones) => action.payload),
    exhaustMap((bloodKetones: BloodKetones) => from(this.bloodKetonesService.saveBloodKetones(bloodKetones)).pipe(
      map(() =>
        new ToggleLoading(false)
      ),
      catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveBloodKetonesFailure()))
    ))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private bloodKetonesService: BloodKetonesService
  ) {
  }
}
