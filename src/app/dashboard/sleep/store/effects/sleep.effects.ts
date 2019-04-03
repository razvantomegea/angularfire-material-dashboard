import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { LogError } from 'app/core/store/app.actions';
import { State } from 'app/core/store/app.reducers';
import { ToggleLoading } from 'app/core/store/layout/actions/app.actions';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { SleepService } from 'app/dashboard/sleep/services/sleep.service';
import { catchError, exhaustMap, from, map, Observable, of, tap } from 'app/shared/utils/rxjs-exports';
import { FirebaseError } from 'firebase/app';
import { Sleep } from '../../model';
import {
  GetSleepChangesFailure,
  GetSleepTrends,
  GetSleepTrendsFailure,
  GetSleepTrendsSuccess,
  QueryTrends,
  SaveSleep,
  SaveSleepFailure,
  SaveSleepSuccess,
  SleepActionTypes
} from '../actions/sleep.actions';

@Injectable()
export class SleepEffects {
  @Effect() public getSleepChanges$: Observable<Action> = this.actions$.pipe(
    ofType(SleepActionTypes.GetSleepChanges),
    exhaustMap(() => this.sleepService.getSleepChanges()),
    map((sleep: Sleep) => new SaveSleepSuccess(sleep)),
    catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error), new GetSleepChangesFailure()))
  );

  @Effect() public getTrends$: Observable<Action> = this.actions$.pipe(
    ofType(SleepActionTypes.GetSleepTrends),
    map((action: GetSleepTrends) => action.payload),
    exhaustMap((query: TrendsQuery) => this.sleepService.getSleepTrendsChanges(query)),
    map((trends: Sleep[]) => new GetSleepTrendsSuccess(trends)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetSleepTrendsFailure()))
  );

  @Effect({ dispatch: false }) public queryTrends$: Observable<any> = this.actions$.pipe(
    ofType(SleepActionTypes.QueryTrends),
    tap((action: QueryTrends) => this.sleepService.querySleepTrends(action.payload)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetSleepTrendsFailure()))
  );

  @Effect() public saveSleep$: Observable<Action> = this.actions$.pipe(
    ofType(SleepActionTypes.SaveSleep),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: SaveSleep) => action.payload),
    exhaustMap((sleep: Sleep) => from(this.sleepService.saveSleep(sleep)).pipe(map(() =>
      new ToggleLoading(false)
    ), catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveSleepFailure()))))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private sleepService: SleepService
  ) {
  }
}
