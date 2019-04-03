import { Tracker } from 'app/shared/models';
import { Meal } from './meal';
import { Nutrition } from './nutrition';

export class NutritionMetrics {
  constructor(
    public fullnessFactor: number = 0,
    public insulinLoad: number = 0,
    public score: number = 0,
    public thermicEffect: number = 0
  ) {
  }
}

export class Diet extends Tracker {
  constructor(
    public meals: Meal[] = [],
    public requiredNutrition: Nutrition = {},
    public remainingNutrition: Nutrition = {},
    public completedNutrition: Nutrition = {},
    public metrics: NutritionMetrics = new NutritionMetrics(),
    public quantity: number = 0,
    public unit: string = 'g'
  ) {
    super();
  }
}
