import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { BodyComposition } from 'app/dashboard/body-composition/model';
import { BodyCompositionService } from 'app/dashboard/body-composition/services';
import { catchError, exhaustMap, from, map, mergeMap, Observable, of, tap } from 'app/shared/utils/rxjs-exports';
import { FirebaseError } from 'firebase/app';
import { LogError } from '../../app.actions';
import { State } from '../../app.reducers';
import { ToggleLoading } from '../../layout/actions/app.actions';
import {
  BodyCompositionActionTypes,
  GetBodyCompositionChangesFailure,
  GetBodyCompositionTrends,
  GetBodyCompositionTrendsSuccess,
  SaveBodyComposition,
  SaveBodyCompositionFailure,
  SaveBodyCompositionSuccess
} from '../actions/body-composition.actions';

@Injectable()
export class BodyCompositionEffects {
  @Effect() public getTrends$: Observable<Action> = this.actions$.pipe(
    ofType(BodyCompositionActionTypes.GetBodyCompositionTrends),
    map((action: GetBodyCompositionTrends) => action.payload),
    exhaustMap(() => this.bodyCompositionService.getBodyCompositionTrendsChanges()),
    map((trends: BodyComposition[]) => new GetBodyCompositionTrendsSuccess(trends)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetBodyCompositionChangesFailure()))
  );

  @Effect() public query$: Observable<Action> = this.actions$.pipe(
    ofType(BodyCompositionActionTypes.GetBodyCompositionChanges),
    exhaustMap(() => this.bodyCompositionService.getBodyCompositionChanges()),
    map((bodyComposition: BodyComposition) => new SaveBodyCompositionSuccess(bodyComposition)),
    catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error), new GetBodyCompositionChangesFailure()))
  );

  @Effect() public saveBodyComposition$: Observable<Action> = this.actions$.pipe(
    ofType(BodyCompositionActionTypes.SaveBodyComposition),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: SaveBodyComposition) => action.payload),
    exhaustMap((bodyComposition: BodyComposition) => from(this.bodyCompositionService.saveBodyComposition(
      bodyComposition))
      .pipe(
        mergeMap((bc: BodyComposition) => [
          new SaveBodyCompositionSuccess(bc),
          new ToggleLoading(false)
        ]),
        catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveBodyCompositionFailure()))
      ))
  );

  constructor(
    private actions$: Actions,
    private bodyCompositionService: BodyCompositionService,
    private store$: Store<State>
  ) {
  }
}
