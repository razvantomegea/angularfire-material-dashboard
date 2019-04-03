import { Action } from '@ngrx/store';
import { Food } from 'app/dashboard/foods/model/food';
import { USDAListQueryParams, USDANutrient } from 'app/dashboard/nutrition/model';

import {
  FoodReport,
  FoodSearch,
  FoodSort,
  USDAFoodReportQueryParams,
  USDANutrientReportQueryParams,
  USDASearchQueryParams
} from '../../model';

export enum FoodsActionTypes {
  DeleteFood = '[Foods] Delete Food',
  DeleteFoodFailure = '[Foods] Delete Food Failure',
  DeleteFoodSuccess = '[Foods] Delete Food Success',
  GetFoodReport = '[Foods] Get Food Report',
  GetFoodReportFailure = '[Foods] Get Food Report Failure',
  GetFoodReportSuccess = '[Foods] Get Food Report Success',
  GetFoodsChanges = '[Foods] Get Foods Changes',
  GetFoodsChangesFailure = '[Foods] Get Foods Changes Failure',
  GetFoodsChangesSuccess = '[Foods] Get Foods Changes Success',
  GetNutrientReports = '[Foods] Get Nutrient Reports',
  GetNutrientReportsFailure = '[Foods] Get Nutrient Reports Failure',
  GetNutrientReportsSuccess = '[Foods] Get Nutrient Reports Success',
  GetNutrients = '[Foods] Get Nutrients',
  GetNutrientsFailure = '[Foods] Get Nutrients Failure',
  GetNutrientsSuccess = '[Foods] Get Nutrients Success',
  QueryFoods = '[Foods] Query Foods',
  SaveFood = '[Foods] Save Food',
  SaveFoodFailure = '[Foods] Save Food Failure',
  SaveFoodSuccess = '[Foods] Save Food Success',
  SearchFoods = '[Foods] Search Foods',
  SearchFoodsFailure = '[Foods] Search Foods Failure',
  SearchFoodsSuccess = '[Foods] Search Foods Success',
  SelectFood = '[Foods] Select Food'
}

export class DeleteFood implements Action {
  readonly type = FoodsActionTypes.DeleteFood;

  constructor(public payload: string) {
  }
}

export class DeleteFoodFailure implements Action {
  readonly type = FoodsActionTypes.DeleteFoodFailure;

  constructor() {
  }
}

export class DeleteFoodSuccess implements Action {
  readonly type = FoodsActionTypes.DeleteFoodSuccess;

  constructor(public payload: string) {
  }
}

export class GetFoodReport implements Action {
  readonly type = FoodsActionTypes.GetFoodReport;

  constructor(public payload: USDAFoodReportQueryParams) {
  }
}

export class GetFoodReportFailure implements Action {
  readonly type = FoodsActionTypes.GetFoodReportFailure;

  constructor() {
  }
}

export class GetFoodReportSuccess implements Action {
  readonly type = FoodsActionTypes.GetFoodReportSuccess;

  constructor(public payload: FoodReport) {
  }
}

export class GetFoodsChanges implements Action {
  readonly type = FoodsActionTypes.GetFoodsChanges;

  constructor() {
  }
}

export class GetFoodsChangesFailure implements Action {
  readonly type = FoodsActionTypes.GetFoodsChangesFailure;

  constructor() {
  }
}

export class GetFoodsChangesSuccess implements Action {
  readonly type = FoodsActionTypes.GetFoodsChangesSuccess;

  constructor(public payload: Food[]) {
  }
}

export class GetNutrientReports implements Action {
  readonly type = FoodsActionTypes.GetNutrientReports;

  constructor(public payload: USDANutrientReportQueryParams) {
  }
}

export class GetNutrientReportsFailure implements Action {
  readonly type = FoodsActionTypes.GetNutrientReportsFailure;

  constructor() {
  }
}

export class GetNutrientReportsSuccess implements Action {
  readonly type = FoodsActionTypes.GetNutrientReportsSuccess;

  constructor(public payload: FoodSort[]) {
  }
}

export class GetNutrients implements Action {
  readonly type = FoodsActionTypes.GetNutrients;

  constructor(public payload: USDAListQueryParams) {
  }
}

export class GetNutrientsFailure implements Action {
  readonly type = FoodsActionTypes.GetNutrientsFailure;

  constructor() {
  }
}

export class GetNutrientsSuccess implements Action {
  readonly type = FoodsActionTypes.GetNutrientsSuccess;

  constructor(public payload: USDANutrient[]) {
  }
}

export class QueryFoods implements Action {
  readonly type = FoodsActionTypes.QueryFoods;

  constructor(public payload: string) {
  }
}

export class SaveFood implements Action {
  readonly type = FoodsActionTypes.SaveFood;

  constructor(public payload: Food) {
  }
}

export class SaveFoodFailure implements Action {
  readonly type = FoodsActionTypes.SaveFoodFailure;

  constructor() {
  }
}

export class SaveFoodSuccess implements Action {
  readonly type = FoodsActionTypes.SaveFoodSuccess;

  constructor(public payload: Food) {
  }
}

export class SearchFoods implements Action {
  readonly type = FoodsActionTypes.SearchFoods;

  constructor(public payload: USDASearchQueryParams) {
  }
}

export class SearchFoodsFailure implements Action {
  readonly type = FoodsActionTypes.SearchFoodsFailure;

  constructor() {
  }
}

export class SearchFoodsSuccess implements Action {
  readonly type = FoodsActionTypes.SearchFoodsSuccess;

  constructor(public payload: FoodSearch[]) {
  }
}

export class SelectFood implements Action {
  readonly type = FoodsActionTypes.SelectFood;

  constructor(public payload: string) {
  }
}


export type FoodsActionsUnion =
  DeleteFood
  | DeleteFoodFailure
  | DeleteFoodSuccess
  | GetFoodReport
  | GetFoodReportFailure
  | GetFoodReportSuccess
  | GetFoodsChanges
  | GetFoodsChangesFailure
  | GetFoodsChangesSuccess
  | GetNutrientReports
  | GetNutrientReportsFailure
  | GetNutrientReportsSuccess
  | GetNutrients
  | GetNutrientsFailure
  | GetNutrientsSuccess
  | QueryFoods
  | SaveFood
  | SaveFoodFailure
  | SaveFoodSuccess
  | SearchFoods
  | SearchFoodsFailure
  | SearchFoodsSuccess
  | SelectFood;
