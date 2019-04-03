import { Food } from 'app/dashboard/foods/model/food';
import { USDANutrient } from 'app/dashboard/nutrition/model';
import { FoodReport, FoodSearch, FoodSort } from '../../model';
import { FoodsActionsUnion, FoodsActionTypes } from '../actions/foods.actions';


export interface FoodsState {
  foodReports: FoodReport[];
  foodSearch: FoodSearch[];
  foodSearchWithOffset: boolean;
  foodSort: FoodSort[];
  foods: Food[];
  isPending: number;
  isWatchingFoods: boolean;
  nutrients: USDANutrient[];
  selectedFood: Food;
  selectedFoodReport: FoodReport;
}

export const initialState: FoodsState = {
  foodReports: [],
  foods: [],
  foodSearch: [],
  foodSearchWithOffset: false,
  foodSort: [],
  isPending: 0,
  isWatchingFoods: false,
  nutrients: [],
  selectedFood: null,
  selectedFoodReport: null
};

export function reducer(state = initialState, action: FoodsActionsUnion): FoodsState {
  switch (action.type) {

    case FoodsActionTypes.GetFoodsChanges:
      return {
        ...state,
        isPending: state.isWatchingFoods ? state.isPending : state.isPending + 1,
        isWatchingFoods: true
      };

    case FoodsActionTypes.DeleteFood:
    case FoodsActionTypes.GetFoodReport:
    case FoodsActionTypes.GetNutrientReports:
    case FoodsActionTypes.GetNutrients:
    case FoodsActionTypes.SaveFood:
      return {
        ...state,
        isPending: state.isPending + 1
      };

    case FoodsActionTypes.SearchFoods:
      return {
        ...state,
        foodSearchWithOffset: !!action.payload.offset,
        isPending: state.isPending + 1
      };

    case FoodsActionTypes.DeleteFoodFailure:
    case FoodsActionTypes.GetFoodReportFailure:
    case FoodsActionTypes.GetFoodsChangesFailure:
    case FoodsActionTypes.GetNutrientReportsFailure:
    case FoodsActionTypes.GetNutrientsFailure:
    case FoodsActionTypes.SaveFoodFailure:
    case FoodsActionTypes.SearchFoodsFailure:
      return {
        ...state,
        isPending: 0
      };

    case FoodsActionTypes.DeleteFoodSuccess:
      const foods: Food[] = state.foods || [];
      const foodIndex: number = foods.findIndex((food: Food) => food.id === action.payload);

      return {
        ...state,
        foods: [...foods.slice(0, foodIndex), ...foods.slice(foodIndex + 1)],
        isPending: state.isPending - 1
      };

    case FoodsActionTypes.SaveFoodSuccess:
      const currFoods: Food[] = state.foods || [];
      const currFoodIndex: number = currFoods.findIndex((food: Food) => food.id === action.payload.id);

      return {
        ...state,
        foods: [...currFoods.slice(0, currFoodIndex), action.payload, ...currFoods.slice(currFoodIndex + 1)],
        isPending: state.isPending - 1
      };

    case FoodsActionTypes.GetFoodReportSuccess:
      return {
        ...state,
        foodReports: [...state.foodReports, action.payload],
        isPending: state.isPending - 1,
        selectedFoodReport: action.payload
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
        foodSort: [],
        isPending: 0 // FIXME: isPending remains 2
      };

    case FoodsActionTypes.GetNutrientReportsSuccess:
      return {
        ...state,
        foodSearch: [],
        foodSort: [...action.payload],
        isPending: state.isPending - 1
      };

    case FoodsActionTypes.GetNutrientsSuccess:
      return {
        ...state,
        nutrients: [...action.payload],
        isPending: state.isPending - 1
      };

    case FoodsActionTypes.SelectFood:
      return {
        ...state,
        selectedFood: state.foods ? state.foods.find((f: Food) => f.id === action.payload) : null
      };

    default:
      return state;
  }
}

export const getFoodReports = (state: FoodsState) => state ? state.foodReports : [];
export const getFoods = (state: FoodsState) => state ? state.foods : [];
export const getFoodSearch = (state: FoodsState) => state ? state.foodSearch : [];
export const getFoodSort = (state: FoodsState) => state ? state.foodSort : [];
export const getIsPending = (state: FoodsState) => state ? state.isPending : 0;
export const getNutrients = (state: FoodsState) => state ? state.nutrients : [];
export const getSelectedFood = (state: FoodsState) => state ? state.selectedFood : null;
export const getSelectedFoodReport = (state: FoodsState) => state ? state.selectedFoodReport : null;
