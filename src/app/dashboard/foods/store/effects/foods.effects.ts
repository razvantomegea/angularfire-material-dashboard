import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { LogError } from 'app/core/store/app.actions';
import { ToggleLoading } from 'app/core/store/layout/actions/app.actions';
import { Food } from 'app/dashboard/foods/model/food';
import { USDAListQueryParams, USDANutrient } from 'app/dashboard/nutrition/model';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  from,
  map,
  mergeMap,
  Observable,
  of,
  tap,
  withLatestFrom
} from 'app/shared/utils/rxjs-exports';
import { FirebaseError } from 'firebase/app';
import {
  FoodReport,
  FoodSearch,
  FoodSort,
  USDAFoodReportQueryParams,
  USDANutrientReportQueryParams,
  USDASearchQueryParams
} from '../../model';
import { FoodsService } from '../../services/foods.service';
import {
  DeleteFood,
  DeleteFoodFailure,
  DeleteFoodSuccess,
  FoodsActionTypes,
  GetFoodReport,
  GetFoodReportFailure,
  GetFoodReportSuccess,
  GetFoodsChangesFailure,
  GetFoodsChangesSuccess,
  GetNutrientReports,
  GetNutrientReportsFailure,
  GetNutrientReportsSuccess,
  GetNutrients,
  GetNutrientsFailure,
  GetNutrientsSuccess,
  QueryFoods,
  SaveFood,
  SaveFoodFailure,
  SaveFoodSuccess,
  SearchFoods,
  SearchFoodsFailure,
  SearchFoodsSuccess
} from '../actions/foods.actions';
import { FoodsState } from '../reducers';

@Injectable()
export class FoodsEffects {
  @Effect() public deleteFood$: Observable<Action> = this.actions$.pipe(
    ofType(FoodsActionTypes.DeleteFood),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: DeleteFood) => action.payload),
    exhaustMap((id: string) => from(this.foodsService.deleteFood(id)).pipe(mergeMap(() => [
      new DeleteFoodSuccess(id),
      new ToggleLoading(false)
    ]), catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new DeleteFoodFailure()))))
  );

  @Effect() public getFoodReport$: Observable<Action> = this.actions$.pipe(
    ofType(FoodsActionTypes.GetFoodReport),
    withLatestFrom(this.store$),
    map(([action, state]) => {
      if (!state.foodReports || !state.foodReports.length) {
        return (<GetFoodReport>action).payload;
      }

      const foodReport: FoodReport = state.foodReports.find((report: FoodReport) => report.desc.ndbno ===
        (<GetFoodReport>action).payload.ndbno);

      return foodReport || (<GetFoodReport>action).payload;
    }),
    exhaustMap((data: FoodReport | USDAFoodReportQueryParams) => {
      if (Reflect.has(data, 'desc')) {
        return of(
          new GetFoodReportSuccess(<FoodReport>data)
        );
      }

      return this.foodsService.getUSDAFoodReport(<USDAFoodReportQueryParams>data).pipe(
        map((foodReport: FoodReport) => new GetFoodReportSuccess(foodReport)),
        catchError((err: FirebaseError | TypeError | Error | SyntaxError | HttpErrorResponse) => of(
          new LogError(err),
          new GetFoodReportFailure()
        ))
      );
    })
  );

  @Effect() public getFoods$: Observable<Action> = this.actions$.pipe(
    ofType(FoodsActionTypes.GetFoodsChanges),
    exhaustMap(() => this.foodsService.getFoodChanges()),
    map((foods: Food[]) => new GetFoodsChangesSuccess(foods)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetFoodsChangesFailure()))
  );

  @Effect() public getNutrientReports$: Observable<Action> = this.actions$.pipe(
    ofType(FoodsActionTypes.GetNutrientReports),
    map((action: GetNutrientReports) => action.payload),
    exhaustMap((params: USDANutrientReportQueryParams) => this.foodsService.getUSDANutrientReports(params)),
    map((foods: FoodSort[]) => new GetNutrientReportsSuccess(foods)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetNutrientReportsFailure()))
  );

  @Effect() public getNutrients$: Observable<Action> = this.actions$.pipe(
    ofType(FoodsActionTypes.GetNutrients),
    map((action: GetNutrients) => action.payload),
    exhaustMap((params: USDAListQueryParams) => this.foodsService.getUSDAList(params)),
    map((nutrients: USDANutrient[]) => new GetNutrientsSuccess(nutrients)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetNutrientsFailure()))
  );

  @Effect({ dispatch: false }) public queryFoods$: Observable<any> = this.actions$.pipe(
    ofType(FoodsActionTypes.QueryFoods),
    tap((action: QueryFoods) => of(this.foodsService.queryFoods(action.payload))),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetFoodsChangesFailure()))
  );

  @Effect() public saveFood$: Observable<Action> = this.actions$.pipe(
    ofType(FoodsActionTypes.SaveFood),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: SaveFood) => action.payload),
    exhaustMap((food: Food) => from(this.foodsService.saveFood(food)).pipe(mergeMap((f: Food) => [
      new SaveFoodSuccess(f),
      new ToggleLoading(false)
    ]), catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveFoodFailure()))))
  );

  @Effect() public searchUSDAFoods$: Observable<Action> = this.actions$.pipe(
    ofType(FoodsActionTypes.SearchFoods),
    map((action: SearchFoods) => action.payload),
    debounceTime(1000),
    distinctUntilChanged(),
    exhaustMap((queryParams: USDASearchQueryParams) => this.foodsService.searchUSDAFoods(queryParams)
      .pipe(
        map((foods: FoodSearch[]) => new SearchFoodsSuccess(foods)),
        catchError((err: FirebaseError | TypeError | Error | SyntaxError | HttpErrorResponse) => of(
          new LogError(err),
          new SearchFoodsFailure()
        ))
      ))
  );

  constructor(private actions$: Actions, private foodsService: FoodsService, private store$: Store<FoodsState>) {
  }
}
