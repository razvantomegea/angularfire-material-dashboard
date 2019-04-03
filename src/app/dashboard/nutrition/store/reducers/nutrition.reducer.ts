import { Food, FoodSearch, USDANutrient } from 'app/dashboard/foods/model';
import { FoodsActionsUnion, FoodsActionTypes } from 'app/dashboard/foods/store/actions/foods.actions';
import { Meal } from 'app/dashboard/nutrition/model/meal';

import { Diet, Nutrition } from '../../model';
import { NutritionActionsUnion, NutritionActionTypes } from '../actions/nutrition.actions';

export interface NutritionState {
  diet: Diet;
  favoriteMeals: Meal[];
  foodSearch: FoodSearch[];
  foodSearchWithOffset: boolean;
  foods: Food[];
  isDirty: boolean;
  isPending: number;
  isWatchingDiet: boolean;
  isWatchingFoods: boolean;
  isWatchingMeals: boolean;
  isWatchingTrends: boolean;
  nutrients: USDANutrient[];
  requiredNutrition: Nutrition;
  selectedMeal: Meal;
  trends: Diet[];
}

export const initialState: NutritionState = {
  diet: new Diet(),
  foods: [],
  foodSearch: [],
  foodSearchWithOffset: false,
  isDirty: false,
  isPending: 0,
  isWatchingDiet: false,
  isWatchingFoods: false,
  isWatchingMeals: false,
  isWatchingTrends: false,
  favoriteMeals: [],
  nutrients: [],
  requiredNutrition: null,
  selectedMeal: new Meal(),
  trends: []
};

export function reducer(state = initialState, action: NutritionActionsUnion | FoodsActionsUnion): NutritionState {
  switch (action.type) {

    case NutritionActionTypes.GetDietChanges:
      return {
        ...state,
        isPending: state.isWatchingDiet ? state.isPending : state.isPending + 1,
        isWatchingDiet: true
      };

    case FoodsActionTypes.GetFoodsChanges:
      return {
        ...state,
        isPending: state.isWatchingFoods ? state.isPending : state.isPending + 1,
        isWatchingFoods: true
      };

    case FoodsActionTypes.SearchFoods:
      return {
        ...state,
        foodSearchWithOffset: !!action.payload.offset,
        isPending: state.isPending + 1
      };

    case NutritionActionTypes.DeleteFavoriteMeal:
    case NutritionActionTypes.SaveFavoriteMeal:
      return {
        ...state,
        isPending: state.isPending + 1,
        selectedMeal: action.payload
      };

    case NutritionActionTypes.GetDietTrends:
      return {
        ...state,
        isPending: state.isWatchingTrends ? state.isPending : state.isPending + 1,
        isWatchingTrends: true
      };

    case NutritionActionTypes.GetFavoriteMealsChanges:
      return {
        ...state,
        isPending: state.isWatchingMeals ? state.isPending : state.isPending + 1,
        isWatchingMeals: true
      };

    case NutritionActionTypes.SaveDiet:
      return {
        ...state,
        isPending: state.isPending + 1
      };

    case NutritionActionTypes.DeleteFavoriteMealFailure:
    case NutritionActionTypes.GetDietChangesFailure:
    case NutritionActionTypes.GetDietTrendsFailure:
    case NutritionActionTypes.GetFavoriteMealsChangesFailure:
    case NutritionActionTypes.SaveDietFailure:
    case NutritionActionTypes.SaveFavoriteMealFailure:
    case FoodsActionTypes.GetFoodsChangesFailure:
    case FoodsActionTypes.GetNutrientsFailure:
    case FoodsActionTypes.SearchFoodsFailure:
      return {
        ...state,
        isPending: 0
      };

    case NutritionActionTypes.DeleteFavoriteMealSuccess:
      const { isPending, selectedMeal } = state;
      selectedMeal.name = '';

      return {
        ...state,
        isPending: isPending - 1,
        selectedMeal
      };


    case NutritionActionTypes.SaveFavoriteMealSuccess:
      return {
        ...state,
        isPending: state.isPending - 1
      };

    case NutritionActionTypes.GetDietTrendsSuccess:
      return {
        ...state,
        trends: [...action.payload],
        isPending: state.isPending - 1
      };

    case FoodsActionTypes.GetFoodsChangesSuccess:
      return {
        ...state,
        foods: [...action.payload],
        isPending: state.isPending - 1
      };

    case FoodsActionTypes.SearchFoodsSuccess:
      return {
        ...state,
        foodSearch: state.foodSearchWithOffset ? [...state.foodSearch, ...action.payload] : [...action.payload],
        foodSearchWithOffset: false,
        isPending: 0 // FIXME: isPending remains 2
      };

    case FoodsActionTypes.GetNutrientsSuccess:
      return {
        ...state,
        nutrients: [...action.payload],
        isPending: state.isPending - 1
      };

    case NutritionActionTypes.GetFavoriteMealsChangesSuccess:
      return {
        ...state,
        favoriteMeals: [...action.payload],
        isPending: state.isPending - 1
      };

    case NutritionActionTypes.GetRequiredNutritionSuccess:
      return {
        ...state,
        requiredNutrition: action.payload
      };

    case NutritionActionTypes.SaveDietSuccess:
      return {
        ...state,
        diet: action.payload,
        isDirty: false,
        isPending: state.isPending - 1,
        selectedMeal: new Meal()
      };

    case NutritionActionTypes.DeleteMeal:
      const meal: Meal = action.payload;
      const currMeals: Meal[] = (state.diet || new Diet()).meals;
      const mealIndex: number = currMeals.findIndex((m: Meal) => m.timestamp === meal.timestamp);

      return {
        ...state,
        diet: { ...state.diet, meals: [...currMeals.slice(0, mealIndex), ...currMeals.slice(mealIndex + 1)] },
        isDirty: true
      };

    case NutritionActionTypes.SaveMeal:
      const newMeal: Meal = action.payload;
      const meals: Meal[] = (state.diet || new Diet()).meals;
      const existingMealIndex: number = meals.findIndex((m: Meal) => m.timestamp === newMeal.timestamp);

      return {
        ...state,
        diet: {
          ...(state.diet || new Diet()),
          meals: existingMealIndex !== -1 ? [...meals.slice(0, existingMealIndex), newMeal, ...meals.slice(existingMealIndex + 1)] : [
            ...meals,
            newMeal
          ]
        },
        isDirty: true
      };

    case FoodsActionTypes.GetNutrients:
      return {
        ...state,
        isPending: state.isPending + 1
      };

    case NutritionActionTypes.SelectMealSuccess:
      return {
        ...state,
        selectedMeal: action.payload
      };

    default:
      return state;
  }
}

export const getDiet = (state: NutritionState) => state ? state.diet : new Diet();
export const getDietTrends = (state: NutritionState) => state ? state.trends : [];
export const getFavoriteMeals = (state: NutritionState) => state ? state.favoriteMeals : [];
export const getFoods = (state: NutritionState) => state ? state.foods : [];
export const getFoodSearch = (state: NutritionState) => state ? state.foodSearch : [];
export const getIsDirty = (state: NutritionState) => state ? state.isDirty : false;
export const getIsPending = (state: NutritionState) => state ? state.isPending : 0;
export const getNutrients = (state: NutritionState) => state ? state.nutrients : [];
export const getRequiredNutrition = (state: NutritionState) => state ? state.requiredNutrition : null;
export const getSelectedMeal = (state: NutritionState) => state ? state.selectedMeal : new Meal();
