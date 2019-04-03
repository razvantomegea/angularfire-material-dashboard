import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { NotificationService } from 'app/core/services';
import { LogError } from 'app/core/store/app.actions';
import { State } from 'app/core/store/app.reducers';
import { ToggleLoading } from 'app/core/store/layout/actions/app.actions';
import { Food, FoodSearch, USDAListQueryParams, USDANutrient, USDASearchQueryParams } from 'app/dashboard/foods/model';
import { FoodsService } from 'app/dashboard/foods/services/foods.service';
import {
  FoodsActionTypes,
  GetFoodsChangesFailure,
  GetFoodsChangesSuccess,
  GetNutrients,
  GetNutrientsFailure,
  GetNutrientsSuccess,
  QueryFoods,
  SearchFoods,
  SearchFoodsFailure,
  SearchFoodsSuccess
} from 'app/dashboard/foods/store/actions/foods.actions';
import { Meal } from 'app/dashboard/nutrition/model/meal';
import { NutritionService } from 'app/dashboard/nutrition/services/nutrition.service';
import { TrendsQuery } from 'app/dashboard/shared/model';
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
import { Diet, Nutrition } from '../../model';
import {
  DeleteFavoriteMeal,
  DeleteFavoriteMealFailure,
  DeleteFavoriteMealSuccess,
  GetDietChangesFailure,
  GetDietTrends,
  GetDietTrendsFailure,
  GetDietTrendsSuccess,
  GetFavoriteMealsChangesFailure,
  GetFavoriteMealsChangesSuccess,
  GetRequiredNutritionFailure,
  GetRequiredNutritionSuccess,
  NutritionActionTypes,
  QueryFavoriteMeals,
  QueryTrends,
  SaveDiet,
  SaveDietFailure,
  SaveDietSuccess,
  SaveFavoriteMeal,
  SaveFavoriteMealFailure,
  SaveFavoriteMealSuccess,
  SelectMeal,
  SelectMealFailure,
  SelectMealSuccess
} from '../actions/nutrition.actions';

@Injectable()
export class NutritionEffects {
  @Effect() public deleteFavoriteMeal$: Observable<Action> = this.actions$.pipe(
    ofType(NutritionActionTypes.DeleteFavoriteMeal),
    map((action: DeleteFavoriteMeal) => action.payload.id),
    exhaustMap((id: string) => from(this.nutritionService.deleteFavoriteMeal(id)).pipe(
      map(() => new DeleteFavoriteMealSuccess(id)),
      tap(() => {
        this.notificationService.showSuccess('Meal successfully removed from favorites!');
      }),
      catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new DeleteFavoriteMealFailure()))
    ))
  );

  @Effect() public getDietChanges$: Observable<Action> = this.actions$.pipe(
    ofType(NutritionActionTypes.GetDietChanges),
    exhaustMap(() => this.nutritionService.getDietChanges()),
    map((diet: Diet) => new SaveDietSuccess(diet)),
    catchError((error: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(error), new GetDietChangesFailure()))
  );

  @Effect() public getFoods$: Observable<Action> = this.actions$.pipe(
    ofType(FoodsActionTypes.GetFoodsChanges),
    exhaustMap(() => this.foodsService.getFoodChanges()),
    map((foods: Food[]) => new GetFoodsChangesSuccess(foods)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetFoodsChangesFailure()))
  );

  @Effect() public getFavoriteMeals$: Observable<Action> = this.actions$.pipe(
    ofType(NutritionActionTypes.GetFavoriteMealsChanges),
    exhaustMap(() => this.nutritionService.getMealChanges()),
    map((meals: Meal[]) => new GetFavoriteMealsChangesSuccess(meals)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetFavoriteMealsChangesFailure()))
  );

  @Effect() public getNutrients$: Observable<Action> = this.actions$.pipe(
    ofType(FoodsActionTypes.GetNutrients),
    map((action: GetNutrients) => action.payload),
    exhaustMap((params: USDAListQueryParams) => this.foodsService.getUSDAList(params)),
    map((nutrients: USDANutrient[]) => new GetNutrientsSuccess(nutrients)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetNutrientsFailure()))
  );

  @Effect() public getRequiredNutrition$: Observable<Action> = this.actions$.pipe(
    ofType(NutritionActionTypes.GetRequiredNutrition),
    exhaustMap(() => from(this.nutritionService.getRequiredNutrition()).pipe(
      map((nutrition: Nutrition) => new GetRequiredNutritionSuccess(nutrition)),
      catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetRequiredNutritionFailure()))
    ))
  );

  @Effect() public getTrends$: Observable<Action> = this.actions$.pipe(
    ofType(NutritionActionTypes.GetDietTrends),
    map((action: GetDietTrends) => action.payload),
    exhaustMap((query: TrendsQuery) => this.nutritionService.getDietTrendsChanges(query)),
    map((trends: Diet[]) => new GetDietTrendsSuccess(trends)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetDietTrendsFailure()))
  );

  @Effect({ dispatch: false }) public queryFoods$: Observable<any> = this.actions$.pipe(
    ofType(FoodsActionTypes.QueryFoods),
    tap((action: QueryFoods) => of(this.foodsService.queryFoods(action.payload))),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetFoodsChangesFailure()))
  );

  @Effect({ dispatch: false }) public queryMeals$: Observable<any> = this.actions$.pipe(
    ofType(NutritionActionTypes.QueryFavoriteMeals),
    tap((action: QueryFavoriteMeals) => this.nutritionService.queryMeals(action.payload)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetFavoriteMealsChangesFailure()))
  );

  @Effect({ dispatch: false }) public queryTrends$: Observable<any> = this.actions$.pipe(
    ofType(NutritionActionTypes.QueryTrends),
    tap((action: QueryTrends) => this.nutritionService.queryDietTrends(action.payload)),
    catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new GetDietTrendsFailure()))
  );

  @Effect() public saveDiet$: Observable<Action> = this.actions$.pipe(
    ofType(NutritionActionTypes.SaveDiet),
    tap(() => {
      this.store$.dispatch(new ToggleLoading(true));
    }),
    map((action: SaveDiet) => action.payload),
    exhaustMap((diet: Diet) => from(this.nutritionService.saveDiet(diet)).pipe(map(() =>
      new ToggleLoading(false)
    ), catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveDietFailure()))))
  );

  @Effect() public saveFavoriteMeal$: Observable<Action> = this.actions$.pipe(
    ofType(NutritionActionTypes.SaveFavoriteMeal),
    map((action: SaveFavoriteMeal) => action.payload),
    exhaustMap((meal: Meal) => from(this.nutritionService.saveFavoriteMeal(meal)).pipe(map((m: Meal) => new SaveFavoriteMealSuccess(m)),
      tap(() => {
        this.notificationService.showSuccess('Meal successfully added to favorites!');
      }), catchError((err: FirebaseError | TypeError | Error | SyntaxError) => of(new LogError(err), new SaveFavoriteMealFailure()))
    ))
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

  @Effect() public selectMeal$: Observable<Action> = this.actions$.pipe(
    ofType(NutritionActionTypes.SelectMeal),
    withLatestFrom(this.store$),
    exhaustMap(([action, state]: [SelectMeal, State]) => {
      const { diet } = (<any>state).nutrition;

      if (diet && diet.meals && diet.meals.length) {
        return of(new SelectMealSuccess(diet.meals.find((meal: Meal) => meal.timestamp === action.payload)));
      }

      return this.nutritionService.getDietChanges().pipe(
        mergeMap((d: Diet) => [
          new SaveDietSuccess(d),
          new SelectMealSuccess(d && d.meals ? d.meals.find((meal: Meal) => meal.timestamp === action.payload) : new Meal())
        ]),
        catchError((err: FirebaseError | TypeError | Error | SyntaxError | HttpErrorResponse) => of(
          new LogError(err),
          new SelectMealFailure()
        ))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private foodsService: FoodsService,
    private notificationService: NotificationService,
    private nutritionService: NutritionService,
    private store$: Store<State>
  ) {
  }
}
