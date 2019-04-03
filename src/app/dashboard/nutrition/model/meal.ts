import { CUSTOM_TIME_FORMAT } from 'app/shared/material/material.module';
import * as moment from 'moment';

import { Food, FoodReport } from 'app/dashboard/foods/model';
import { NutritionMetrics } from 'app/dashboard/nutrition/model/diet';
import { Nutrition } from 'app/dashboard/nutrition/model/nutrition';
import { Tracker } from 'app/shared/models';

export class Meal extends Tracker {
  constructor(
    public timestamp: string = moment().format(CUSTOM_TIME_FORMAT.display.timeInput),
    public name: string = '',
    public foods: (FoodReport | Food)[] = [],
    public remainingNutrition: Nutrition = {},
    public nutrition: Nutrition = {},
    public metrics: NutritionMetrics = new NutritionMetrics(),
    public quantity: number = 0,
    public unit: string = 'g',
    public notes?: string,
    public id?: string
  ) {
    super(timestamp, notes, id);
  }
}
