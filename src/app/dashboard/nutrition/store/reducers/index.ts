import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromNutrition from './nutrition.reducer';

export const selectNutritionState = createFeatureSelector<fromNutrition.NutritionState>('nutrition');

export const getDiet = createSelector(
  selectNutritionState,
  fromNutrition.getDiet
);

export const getDietTrends = createSelector(
  selectNutritionState,
  fromNutrition.getDietTrends
);

export const getFoods = createSelector(
  selectNutritionState,
  fromNutrition.getFoods
);

export const getFoodSearch = createSelector(
  selectNutritionState,
  fromNutrition.getFoodSearch
);

export const getIsDirty = createSelector(
  selectNutritionState,
  fromNutrition.getIsDirty
);

export const getIsPending = createSelector(
  selectNutritionState,
  fromNutrition.getIsPending
);

export const getFavoriteMeals = createSelector(
  selectNutritionState,
  fromNutrition.getFavoriteMeals
);

export const getNutrients = createSelector(
  selectNutritionState,
  fromNutrition.getNutrients
);

export const getRequiredNutrition = createSelector(
  selectNutritionState,
  fromNutrition.getRequiredNutrition
);

export const getSelectedMeal = createSelector(
  selectNutritionState,
  fromNutrition.getSelectedMeal
);

export * from './nutrition.reducer';
