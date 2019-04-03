import { FoodReport, FoodReportDescription, FoodReportNutrient, Measure } from 'app/dashboard/foods/model/usda-food-report-response';
import { Nutrition, NutritionMetrics } from 'app/dashboard/nutrition/model';

export class FoodDescription implements FoodReportDescription {
  constructor(
    public fg: string,
    public name: string,
    public manu: string,
    public ru: string
  ) {
  }
}

export class Food implements FoodReport {
  constructor(
    public desc: FoodDescription,
    public metrics: NutritionMetrics,
    public nutrition: Nutrition,
    public quantity: number,
    public unit: string,
    public id?: string,
    public nutrients: FoodReportNutrient[] = []
  ) {
  }
}
