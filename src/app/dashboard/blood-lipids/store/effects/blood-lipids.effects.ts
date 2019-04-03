import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { FirebaseError } from 'firebase/app';

import { LogError } from 'app/core/store/app.actions';
import { State } from 'app/core/store/app.reducers';
import { ToggleLoading } from 'app/core/store/layout/actions/app.actions';
import { BloodLipidsService } from 'app/dashboard/blood-lipids/services/blood-lipids.service';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { catchError, exhaustMap, from, map, Observable, of, tap } from 'app/shared/utils/rxjs-exports';
import { BloodLipids } from '../../model';
import {
  BloodLipidsActionTypes,
  GetBloodLipidsChangesFailure,
  GetBloodLipidsTrends,
  GetBloodLipidsTrendsFailure,
  GetBloodLipidsTrendsSuccess,
  QueryTrends,
  SaveBloodLipids,
  SaveBloodLipidsFailure,
  SaveBloodLipidsSuccess
} from '../actions/blood-lipids.actions';

@Injectable()
export class BloodLipidsEffects {
  @Effect() public getBloodLipidsChanges$: Observable<Action> = this.actions$.pipe(
    ofType(BloodLipidsActionTypes.GetBloodLipidsChanges),
    exhaustMap(() => this.bloodLipidsService.getBloodLipidsChanges()),
    map((bloodLipids: BloodLipids) => new SaveBloodLipidsSuccess(bloodLipids)),
    catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error), new GetBloodLipidsChangesFailure()))
  );

  @Effect() public getTrends$: Observable<Action> = this.actions$.pipe(
    ofType(BloodLipidsActionTypes.GetBloodLipidsTrends),
    map((action: GetBloodLipidsTrends) => action.payload),
    exhaustMap((query: TrendsQuery) => this.bloodLipidsService.getBloodLipidsTrendsChanges(query)),
    map((trends: BloodLipids[]) => new GetBloodLipidsTrendsSuccess(trends)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetBloodLipidsTrendsFailure()))
  );

  @Effect({ dispatch: false }) public queryTrends$: Observable<any> = this.actions$.pipe(
    ofType(BloodLipidsActionTypes.QueryTrends),
    tap((action: QueryTrends) => this.bloodLipidsService.queryBloodLipidsTrends(action.payload)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetBloodLipidsTrendsFailure()))
  );

  @Effect() public saveBloodLipids$: Observable<Action> = this.actions$.pipe(
    ofType(BloodLipidsActionTypes.SaveBloodLipids),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: SaveBloodLipids) => action.payload),
    exhaustMap((bloodLipids: BloodLipids) => from(this.bloodLipidsService.saveBloodLipids(bloodLipids)).pipe(map(() =>
      new ToggleLoading(false)
    ), catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveBloodLipidsFailure()))))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private bloodLipidsService: BloodLipidsService
  ) {
  }
}
