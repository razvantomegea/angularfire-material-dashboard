import { Action } from '@ngrx/store';

import { Meal } from 'app/dashboard/nutrition/model/meal';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { Diet, Nutrition } from '../../model';

export enum NutritionActionTypes {
  DeleteFavoriteMeal = '[Nutrition] Delete Favorite Meal',
  DeleteFavoriteMealFailure = '[Nutrition] Delete Favorite Meal Failure',
  DeleteFavoriteMealSuccess = '[Nutrition] Delete Favorite Meal Success',
  DeleteMeal = '[Nutrition] Delete Meal',
  GetDietChanges = '[Nutrition] Get Diet Changes',
  GetDietChangesFailure = '[Nutrition] Get Diet Changes Failure',
  GetDietTrends = '[Nutrition] Get Diet Trends',
  GetDietTrendsFailure = '[Nutrition] Get Diet Trends Failure',
  GetDietTrendsSuccess = '[Nutrition] Get Diet Trends Success',
  GetFavoriteMealsChanges = '[Nutrition] Get Meals Changes',
  GetFavoriteMealsChangesFailure = '[Nutrition] Get Meals Changes Failure',
  GetFavoriteMealsChangesSuccess = '[Nutrition] Get Meals Changes Success',
  GetRequiredNutrition = '[Nutrition] Get Required Nutrition',
  GetRequiredNutritionFailure = '[Nutrition] Get Required Nutrition Failure',
  GetRequiredNutritionSuccess = '[Nutrition] Get Required Nutrition Success',
  QueryFavoriteMeals = '[Nutrition] Query Favorite Meals',
  QueryTrends = '[Nutrition] Query Trends',
  SaveDiet = '[Nutrition] Save Diet',
  SaveDietFailure = '[Nutrition] Save Diet Failure',
  SaveDietSuccess = '[Nutrition] Save Diet Success',
  SaveFavoriteMeal = '[Nutrition] Save Favorite Meal',
  SaveFavoriteMealFailure = '[Nutrition] Save Favorite Meal Failure',
  SaveFavoriteMealSuccess = '[Nutrition] Save Favorite Meal Success',
  SaveMeal = '[Nutrition] Save Meal',
  SelectMeal = '[Nutrition] Select Meal',
  SelectMealFailure = '[Nutrition] Select Meal Failure',
  SelectMealSuccess = '[Nutrition] Select Meal Success'
}

export class DeleteFavoriteMeal implements Action {
  readonly type = NutritionActionTypes.DeleteFavoriteMeal;

  constructor(public payload: Meal) {
  }
}

export class DeleteFavoriteMealFailure implements Action {
  readonly type = NutritionActionTypes.DeleteFavoriteMealFailure;

  constructor() {
  }
}

export class DeleteFavoriteMealSuccess implements Action {
  readonly type = NutritionActionTypes.DeleteFavoriteMealSuccess;

  constructor(public payload: string) {
  }
}

export class DeleteMeal implements Action {
  readonly type = NutritionActionTypes.DeleteMeal;

  constructor(public payload: Meal) {
  }
}

export class GetDietChanges implements Action {
  readonly type = NutritionActionTypes.GetDietChanges;

  constructor() {
  }
}

export class GetDietChangesFailure implements Action {
  readonly type = NutritionActionTypes.GetDietChangesFailure;

  constructor() {
  }
}

export class GetDietTrends implements Action {
  readonly type = NutritionActionTypes.GetDietTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class GetDietTrendsFailure implements Action {
  readonly type = NutritionActionTypes.GetDietTrendsFailure;

  constructor() {
  }
}

export class GetDietTrendsSuccess implements Action {
  readonly type = NutritionActionTypes.GetDietTrendsSuccess;

  constructor(public payload: Diet[]) {
  }
}

export class GetFavoriteMealsChanges implements Action {
  readonly type = NutritionActionTypes.GetFavoriteMealsChanges;

  constructor() {
  }
}

export class GetFavoriteMealsChangesFailure implements Action {
  readonly type = NutritionActionTypes.GetFavoriteMealsChangesFailure;

  constructor() {
  }
}

export class GetFavoriteMealsChangesSuccess implements Action {
  readonly type = NutritionActionTypes.GetFavoriteMealsChangesSuccess;

  constructor(public payload: Meal[]) {
  }
}

export class GetRequiredNutrition implements Action {
  readonly type = NutritionActionTypes.GetRequiredNutrition;

  constructor() {
  }
}

export class GetRequiredNutritionFailure implements Action {
  readonly type = NutritionActionTypes.GetRequiredNutritionFailure;

  constructor() {
  }
}

export class GetRequiredNutritionSuccess implements Action {
  readonly type = NutritionActionTypes.GetRequiredNutritionSuccess;

  constructor(public payload: Nutrition) {
  }
}

export class QueryFavoriteMeals implements Action {
  readonly type = NutritionActionTypes.QueryFavoriteMeals;

  constructor(public payload: string) {
  }
}

export class QueryTrends implements Action {
  readonly type = NutritionActionTypes.QueryTrends;

  constructor(public payload: TrendsQuery) {
  }
}

export class SaveDiet implements Action {
  readonly type = NutritionActionTypes.SaveDiet;

  constructor(public payload: Diet) {
  }
}

export class SaveDietFailure implements Action {
  readonly type = NutritionActionTypes.SaveDietFailure;

  constructor() {
  }
}

export class SaveDietSuccess implements Action {
  readonly type = NutritionActionTypes.SaveDietSuccess;

  constructor(public payload: Diet) {
  }
}

export class SaveFavoriteMeal implements Action {
  readonly type = NutritionActionTypes.SaveFavoriteMeal;

  constructor(public payload: Meal) {
  }
}

export class SaveFavoriteMealFailure implements Action {
  readonly type = NutritionActionTypes.SaveFavoriteMealFailure;

  constructor() {
  }
}

export class SaveFavoriteMealSuccess implements Action {
  readonly type = NutritionActionTypes.SaveFavoriteMealSuccess;

  constructor(public payload: Meal) {
  }
}

export class SaveMeal implements Action {
  readonly type = NutritionActionTypes.SaveMeal;

  constructor(public payload: Meal) {
  }
}

export class SelectMeal implements Action {
  readonly type = NutritionActionTypes.SelectMeal;

  constructor(public payload: string) {
  }
}

export class SelectMealFailure implements Action {
  readonly type = NutritionActionTypes.SelectMealFailure;

  constructor() {
  }
}

export class SelectMealSuccess implements Action {
  readonly type = NutritionActionTypes.SelectMealSuccess;

  constructor(public payload: Meal) {
  }
}

export type NutritionActionsUnion =
  DeleteFavoriteMeal
  | DeleteFavoriteMealFailure
  | DeleteFavoriteMealSuccess
  | DeleteMeal
  | GetDietChanges
  | GetDietChangesFailure
  | GetDietTrends
  | GetDietTrendsFailure
  | GetDietTrendsSuccess
  | GetFavoriteMealsChanges
  | GetFavoriteMealsChangesFailure
  | GetFavoriteMealsChangesSuccess
  | GetRequiredNutrition
  | GetRequiredNutritionFailure
  | GetRequiredNutritionSuccess
  | QueryFavoriteMeals
  | QueryTrends
  | SaveDiet
  | SaveDietFailure
  | SaveDietSuccess
  | SaveFavoriteMeal
  | SaveFavoriteMealFailure
  | SaveFavoriteMealSuccess
  | SaveMeal
  | SelectMeal
  | SelectMealFailure
  | SelectMealSuccess;
