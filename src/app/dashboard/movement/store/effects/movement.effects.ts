import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { NotificationService } from 'app/core/services';
import { LogError } from 'app/core/store/app.actions';
import { State } from 'app/core/store/app.reducers';
import { ToggleLoading } from 'app/core/store/layout/actions/app.actions';
import { ActivityService } from 'app/dashboard/movement/services/activity.service';
import { MovementService } from 'app/dashboard/movement/services/movement.service';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { catchError, exhaustMap, from, map, mergeMap, Observable, of, tap, withLatestFrom } from 'app/shared/utils/rxjs-exports';
import { FirebaseError } from 'firebase/app';
import { Activity, Movement, Session } from '../../model';
import {
  DeleteFavoriteSession,
  DeleteFavoriteSessionFailure,
  DeleteFavoriteSessionSuccess,
  GetActivitiesChanges,
  GetActivitiesChangesFailure,
  GetActivitiesChangesSuccess,
  GetFavoriteSessionsChangesFailure,
  GetFavoriteSessionsChangesSuccess,
  GetMovementChangesFailure,
  GetMovementTrends,
  GetMovementTrendsFailure,
  GetMovementTrendsSuccess,
  MovementActionTypes,
  QueryActivities,
  QueryFavoriteSessions,
  QueryTrends,
  SaveFavoriteSession,
  SaveFavoriteSessionFailure,
  SaveFavoriteSessionSuccess,
  SaveMovement,
  SaveMovementFailure,
  SaveMovementSuccess,
  SelectSession,
  SelectSessionFailure,
  SelectSessionSuccess
} from '../actions/movement.actions';

@Injectable()
export class MovementEffects {
  @Effect() public deleteFavoriteSession$: Observable<Action> = this.actions$.pipe(
    ofType(MovementActionTypes.DeleteFavoriteSession),
    map((action: DeleteFavoriteSession) => action.payload.id),
    exhaustMap((id: string) => from(this.movementService.deleteFavoriteSession(id)).pipe(
      map(() => new DeleteFavoriteSessionSuccess(id)),
      tap(() => {
        this.notificationService.showSuccess('Session successfully removed from favorites!');
      }),
      catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new DeleteFavoriteSessionFailure()))
    ))
  );

  @Effect() public getActivities$: Observable<Action> = this.actions$.pipe(
    ofType(MovementActionTypes.GetActivitiesChanges),
    exhaustMap((action: GetActivitiesChanges) => this.activityService.getActivitiesChanges(action.payload)),
    map((activities: Activity[]) => new GetActivitiesChangesSuccess(activities)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetActivitiesChangesFailure()))
  );

  @Effect() public getFavoriteSessions$: Observable<Action> = this.actions$.pipe(
    ofType(MovementActionTypes.GetFavoriteSessionsChanges),
    exhaustMap(() => this.movementService.getFavoriteSessionsChanges()),
    map((sessions: Session[]) => new GetFavoriteSessionsChangesSuccess(sessions)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetFavoriteSessionsChangesFailure()))
  );

  @Effect() public getMovementChanges$: Observable<Action> = this.actions$.pipe(
    ofType(MovementActionTypes.GetMovementChanges),
    exhaustMap(() => this.movementService.getMovementChanges()),
    map((movement: Movement) => new SaveMovementSuccess(movement)),
    catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error), new GetMovementChangesFailure()))
  );

  @Effect() public getTrends$: Observable<Action> = this.actions$.pipe(
    ofType(MovementActionTypes.GetMovementTrends),
    map((action: GetMovementTrends) => action.payload),
    exhaustMap((query: TrendsQuery) => this.movementService.getMovementTrendsChanges(query)),
    map((trends: Movement[]) => new GetMovementTrendsSuccess(trends)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetMovementTrendsFailure()))
  );

  @Effect({ dispatch: false }) public queryActivities$: Observable<any> = this.actions$.pipe(
    ofType(MovementActionTypes.QueryActivities),
    tap((action: QueryActivities) => of(this.activityService.queryActivities(action.payload))),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetActivitiesChangesFailure()))
  );

  @Effect({ dispatch: false }) public querySessions$: Observable<any> = this.actions$.pipe(
    ofType(MovementActionTypes.QueryFavoriteSessions),
    tap((action: QueryFavoriteSessions) => this.movementService.queryFavoriteSessions(action.payload)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetFavoriteSessionsChangesFailure()))
  );

  @Effect({ dispatch: false }) public queryTrends$: Observable<any> = this.actions$.pipe(
    ofType(MovementActionTypes.QueryTrends),
    tap((action: QueryTrends) => this.movementService.queryMovementTrends(action.payload)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetMovementTrendsFailure()))
  );

  @Effect() public saveFavoriteSession$: Observable<Action> = this.actions$.pipe(
    ofType(MovementActionTypes.SaveFavoriteSession),
    map((action: SaveFavoriteSession) => action.payload),
    exhaustMap((session: Session) => from(this.movementService.saveFavoriteSession(session))
      .pipe(map((m: Session) => new SaveFavoriteSessionSuccess(m)),
        tap(() => {
          this.notificationService.showSuccess('Session successfully added to favorites!');
        }), catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveFavoriteSessionFailure()))
      ))
  );

  @Effect() public saveMovement$: Observable<Action> = this.actions$.pipe(
    ofType(MovementActionTypes.SaveMovement),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: SaveMovement) => action.payload),
    exhaustMap((movement: Movement) => from(this.movementService.saveMovement(movement)).pipe(map(() =>
      new ToggleLoading(false)
    ), catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveMovementFailure()))))
  );

  @Effect() public selectSession$: Observable<Action> = this.actions$.pipe(
    ofType(MovementActionTypes.SelectSession),
    withLatestFrom(this.store$),
    exhaustMap(([action, state]: [SelectSession, State]) => {
      const { movement } = (<any>state).movement;

      if (movement && movement.sessions && movement.sessions.length) {
        return of(new SelectSessionSuccess(movement.sessions.find((session: Session) => session.timestamp === action.payload)));
      }

      return this.movementService.getMovementChanges().pipe(
        mergeMap((d: Movement) => [
          new SaveMovementSuccess(d),
          new SelectSessionSuccess(d && d.sessions ? d.sessions.find((session: Session) => session.timestamp === action.payload)
            : new Session())
        ]),
        catchError((err: FirebaseError | TypeError | Error | SyntaxError | HttpErrorResponse) => of(
          new LogError(err),
          new SelectSessionFailure()
        ))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private activityService: ActivityService,
    private notificationService: NotificationService,
    private movementService: MovementService,
    private store$: Store<State>
  ) {
  }
}
