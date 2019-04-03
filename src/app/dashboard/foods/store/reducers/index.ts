import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectNutritionState } from 'app/dashboard/nutrition/store/reducers';
import * as fromNutrition from 'app/dashboard/nutrition/store/reducers/nutrition.reducer';

import * as fromFoods from './foods.reducer';

export const selectFoodsState = createFeatureSelector<fromFoods.FoodsState>('foods');

export const getFoodReports = createSelector(
  selectFoodsState,
  fromFoods.getFoodReports
);

export const getFoods = createSelector(
  selectFoodsState,
  fromFoods.getFoods
);

export const getFoodSearch = createSelector(
  selectFoodsState,
  fromFoods.getFoodSearch
);

export const getFoodSort = createSelector(
  selectFoodsState,
  fromFoods.getFoodSort
);

export const getIsPending = createSelector(
  selectFoodsState,
  fromFoods.getIsPending
);

export const getNutrients = createSelector(
  selectFoodsState,
  fromFoods.getNutrients
);

export const getSelectedFood = createSelector(
  selectFoodsState,
  fromFoods.getSelectedFood
);

export const getSelectedFoodReport = createSelector(
  selectFoodsState,
  fromFoods.getSelectedFoodReport
);


export * from './foods.reducer';
