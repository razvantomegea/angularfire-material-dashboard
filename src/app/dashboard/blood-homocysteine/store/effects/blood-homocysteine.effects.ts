import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { FirebaseError } from 'firebase/app';

import { LogError } from 'app/core/store/app.actions';
import { State } from 'app/core/store/app.reducers';
import { ToggleLoading } from 'app/core/store/layout/actions/app.actions';
import { BloodHomocysteineService } from 'app/dashboard/blood-homocysteine/services/blood-homocysteine.service';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { catchError, exhaustMap, from, map, Observable, of, tap } from 'app/shared/utils/rxjs-exports';
import { BloodHomocysteine } from '../../model';
import {
  BloodHomocysteineActionTypes,
  GetBloodHomocysteineChangesFailure,
  GetBloodHomocysteineTrends,
  GetBloodHomocysteineTrendsFailure,
  GetBloodHomocysteineTrendsSuccess,
  QueryTrends,
  SaveBloodHomocysteine,
  SaveBloodHomocysteineFailure,
  SaveBloodHomocysteineSuccess
} from '../actions/blood-homocysteine.actions';

@Injectable()
export class BloodHomocysteineEffects {
  @Effect() public getBloodHomocysteineChanges$: Observable<Action> = this.actions$.pipe(
    ofType(BloodHomocysteineActionTypes.GetBloodHomocysteineChanges),
    exhaustMap(() => this.bloodHomocysteineService.getBloodHomocysteineChanges()),
    map((bloodHomocysteine: BloodHomocysteine) => new SaveBloodHomocysteineSuccess(bloodHomocysteine)),
    catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(
      new LogError(error),
      new GetBloodHomocysteineChangesFailure()
    ))
  );

  @Effect() public getTrends$: Observable<Action> = this.actions$.pipe(
    ofType(BloodHomocysteineActionTypes.GetBloodHomocysteineTrends),
    map((action: GetBloodHomocysteineTrends) => action.payload),
    exhaustMap((query: TrendsQuery) => this.bloodHomocysteineService.getBloodHomocysteineTrendsChanges(query)),
    map((trends: BloodHomocysteine[]) => new GetBloodHomocysteineTrendsSuccess(trends)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetBloodHomocysteineTrendsFailure()))
  );

  @Effect({ dispatch: false }) public queryTrends$: Observable<any> = this.actions$.pipe(
    ofType(BloodHomocysteineActionTypes.QueryTrends),
    tap((action: QueryTrends) => this.bloodHomocysteineService.queryBloodHomocysteineTrends(action.payload)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetBloodHomocysteineTrendsFailure()))
  );

  @Effect() public saveBloodHomocysteine$: Observable<Action> = this.actions$.pipe(
    ofType(BloodHomocysteineActionTypes.SaveBloodHomocysteine),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: SaveBloodHomocysteine) => action.payload),
    exhaustMap((bloodHomocysteine: BloodHomocysteine) => from(this.bloodHomocysteineService.saveBloodHomocysteine(bloodHomocysteine)).pipe(
      map(() =>
        new ToggleLoading(false)
      ),
      catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveBloodHomocysteineFailure()))
    ))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<State>,
    private bloodHomocysteineService: BloodHomocysteineService
  ) {
  }
}
