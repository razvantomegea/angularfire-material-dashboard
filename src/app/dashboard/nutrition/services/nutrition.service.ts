import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { UserService } from 'app/core/services';
import { BodyComposition, BodyMeasurements } from 'app/dashboard/body-composition/model';
import { BodyCompositionService } from 'app/dashboard/body-composition/services';
import { Food, FoodReport, FoodReportNutrient } from 'app/dashboard/foods/model';
import { Movement } from 'app/dashboard/movement/model';
import { MovementService } from 'app/dashboard/movement/services/movement.service';
import { Meal } from 'app/dashboard/nutrition/model/meal';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { DataService } from 'app/shared/mixins';
import { UserInfo } from 'app/shared/models';
import { Observable } from 'app/shared/utils/rxjs-exports';
import {
  BeneficialNutrientNames,
  Diet,
  EssentialNutrientNames,
  Nutrient,
  NutrientGroups,
  NutrientNames,
  Nutrition
} from '../model';

const MEALS_PATH = 'meals';
const MEALS_LIST_PATH = 'list';
const NUTRITION_PATH = 'nutrition';

@Injectable({
  providedIn: 'root'
})
export class NutritionService extends DataService<Diet> {
  constructor(
    protected afAuth: AngularFireAuth,
    protected afs: AngularFirestore,
    private bodyCompositionService: BodyCompositionService,
    private http: HttpClient,
    private movementService: MovementService,
    private userService: UserService
  ) {
    super(afAuth, afs, NUTRITION_PATH);
  }

  /**
   * @desc Calculates the fullness factor (satiety) based on nutrient content
   * https://nutritiondata.self.com/topics/fullness-factor
   * @param {Nutrition} nutrition
   * @returns {number} - Returns a value between 0.5 and 5
   */
  public static calculateFullnessFactor(nutrition: Nutrition): number {
    const energy: Nutrient = nutrition[NutrientNames.Energy];
    const protein: Nutrient = nutrition[NutrientNames.Protein];
    const fiber: Nutrient = nutrition[NutrientNames['Fiber, total dietary']];
    const lipids: Nutrient = nutrition[NutrientNames['Total lipid (fat)']];

    return +Math.max(
      0.5,
      Math.min(
        5.0,
        41.7 / (energy ? energy.value : 1), 0.7
      ) +
      (protein ? protein.value : 0) * 0.05 +
      6.17e-4 * Math.pow((fiber ? fiber.value : 0), 3) -
      7.25e-6 * Math.pow((lipids ? lipids.value : 0), 3) +
      0.617
    ).toFixed(2);
  }

  /**
   * @desc Calculates the amount of insulin released based on nutrient content
   * https://optimisingnutrition.com/2015/07/06/insulin-index-v2/
   * @param {Nutrition} nutrition
   * @returns {number} - Returns a value in percentages
   */
  public static calculateInsulinLoad(nutrition: Nutrition): number {
    const carbs: Nutrient = nutrition[NutrientNames['Carbohydrate, by difference']];
    const protein: Nutrient = nutrition[NutrientNames.Protein];
    const fiber: Nutrient = nutrition[NutrientNames['Fiber, total dietary']];

    return +((carbs ? carbs.value : 0) -
      (fiber ? fiber.value : 0) +
      0.56 * (protein ? protein.value : 0)
    ).toFixed(2);
  }

  /**
   * @desc Calculates the nutrient density
   * https://www.drfuhrman.com/library/eat-to-live-blog/128/andi-meal-scores-rating-the-nutrient-density-of-foods
   * @param {Nutrition} nutrition
   * @returns {Nutrition} - Returns the nutrient density
   */
  public static calculateNutrientDensity(nutrition: Nutrition): Nutrition {
    const nutrientDensity: Nutrition = {};

    for (const key in nutrition) {
      if ((key in EssentialNutrientNames || key in BeneficialNutrientNames) && Reflect.has(nutrientDensity, key)) {
        nutrientDensity[key].value = nutrition[key].value / nutrition[NutrientNames.Energy].value;
      }
    }

    return nutrientDensity;
  }

  /**
   * @desc Calculates the nutrition score based on nutrient content
   * https://www.drfuhrman.com/library/eat-to-live-blog/128/andi-food-scores-rating-the-nutrient-density-of-foods
   * @param {Nutrition} nutrition
   * @returns {number} - Returns the nutrition score
   */
  public static calculateNutritionScore(nutrition: Nutrition): number {
    const foodQuality: Nutrition = this.calculateNutrientDensity(nutrition);
    let score = 0;

    for (const key in foodQuality) {
      if ((key in EssentialNutrientNames || key in BeneficialNutrientNames) && foodQuality[key].value >= 0.25) {
        score++;
      }
    }

    return score;
  }

  /**
   * @desc Calculates the calories burned during digestion based on nutrient content
   * https://optimisingnutrition.com/2015/07/06/insulin-index-v2/
   * @param {Nutrition} nutrition
   * @returns {number} - Returns the total calories burned during digestion
   */
  public static calculateThermicEffect(nutrition: Nutrition): number {
    const carbs: Nutrient = nutrition[NutrientNames['Carbohydrate, by difference']];
    const protein: Nutrient = nutrition[NutrientNames.Protein];
    const fiber: Nutrient = nutrition[NutrientNames['Fiber, total dietary']];
    const lipids: Nutrient = nutrition[NutrientNames['Total lipid (fat)']];

    return Math.round(
      ((carbs ? carbs.value : 0) -
        (fiber ? fiber.value : 0) * 0.05) +
      (fiber ? fiber.value : 0) * 0.15 +
      (protein ? protein.value : 0) * 0.65 +
      (lipids ? lipids.value : 0) * 0.05
    );
  }

  /**
   * @desc Calculates total nutrition for meal or diet by the containing foods or meals respectively
   * @param {(FoodReport | Food | Meal)[]} foods
   * @returns {Nutrition}
   */
  public static getCompletedNutrition(foods: (FoodReport | Food | Meal)[]): Nutrition {
    const nutrition: Nutrition = {};

    foods.forEach((food: FoodReport | Food) => {
      Reflect.deleteProperty(food, 'nutrients');

      Object.keys(food.nutrition).forEach((nutrientKey: string) => {
        const foodNutrient: Nutrient = food.nutrition[nutrientKey];

        Object.keys(foodNutrient).forEach((key: string) => {
          if (Array.isArray(foodNutrient[key]) || !foodNutrient[key]) {
            Reflect.deleteProperty(foodNutrient, key);
          }
        });

        const nutrientValue: number = foodNutrient.value * (food instanceof Meal ? 1 : food.quantity / 100);

        if (!Reflect.has(nutrition, nutrientKey)) {
          Reflect.set(nutrition, nutrientKey, { ...foodNutrient, value: nutrientValue });
        } else {
          // Food reports have nutrition specified per 100 grams by default
          nutrition[nutrientKey].value += nutrientValue;
        }
      });
    });

    return nutrition;
  }

  public static getNutrientGroup(id: string): string {
    const intId: number = parseInt(id, 10);

    if (intId === 262 || intId === 263) {
      return NutrientGroups.other;
    }

    if (intId < 300 || intId === 539) {
      return NutrientGroups.proximates;
    }

    if (intId < 318) {
      return NutrientGroups.minerals;
    }

    if (intId < 500 || (intId > 570 && intId < 580)) {
      return NutrientGroups.vitamins;
    }

    if (intId < 539 && intId > 500) {
      return NutrientGroups.aminoAcids;
    }

    if (intId < 700 || intId > 850) {
      return NutrientGroups.lipids;
    }

    if (intId > 700 && intId < 800) {
      return NutrientGroups.polyphenols;
    }

    if (intId < 731) {
      return NutrientGroups.isoflavones;
    }

    if (intId < 740) {
      return NutrientGroups.proanthocyanidin;
    }

    if (intId < 749) {
      return NutrientGroups.anthocyanidins;
    }

    if (intId < 755 || (intId > 789 && intId < 850)) {
      return NutrientGroups.flavan3ols;
    }

    if (intId < 770) {
      return NutrientGroups.flavanones;
    }

    if (intId < 785) {
      return NutrientGroups.flavones;
    }

    if (intId < 791) {
      return NutrientGroups.flavonols;
    }
  }

  /**
   * @desc Calculates total quantity
   * @param {(FoodReport | Food | Meal)[]} foods
   * @returns {number}
   */
  public static getQuantity(foods: (FoodReport | Food | Meal)[]): number {
    return foods.reduce((acc: number, curr: FoodReport | Food | Meal) => acc += curr.quantity, 0);
  }

  /**
   * @desc Calculates the remaining nutrition in percentages
   * @param {Nutrition} completedNutrition - The completed nutrition
   * @param {Nutrition} requiredNutrition - The required nutrition
   * @returns {Nutrition}
   */
  public static getRemainingNutrition(completedNutrition: Nutrition, requiredNutrition: Nutrition): Nutrition {
    const nutrition: Nutrition = {};

    if (requiredNutrition) {
      Object.keys(requiredNutrition).forEach((nutrientKey: string) => {
        const requiredNutrient: Nutrient = requiredNutrition[nutrientKey];
        const completedNutrient: Nutrient = completedNutrition[nutrientKey];

        if (completedNutrient && requiredNutrient) {
          const remainingNutrient = new Nutrient(
            completedNutrient.group,
            completedNutrient.name,
            completedNutrient.percentage,
            completedNutrient.unit,
            Math.round((completedNutrient.value * 100) / (requiredNutrient.value || 1)),
            completedNutrient.nutrient_id
            )
          ;
          Reflect.set(nutrition, nutrientKey, remainingNutrient);
        }

      });
    }

    return nutrition;
  }

  public static isAntioxidant(nutrientGroup: string): boolean {
    return nutrientGroup === NutrientGroups.anthocyanidins ||
      nutrientGroup === NutrientGroups.flavan3ols ||
      nutrientGroup === NutrientGroups.flavanones ||
      nutrientGroup === NutrientGroups.flavones ||
      nutrientGroup === NutrientGroups.flavonols ||
      nutrientGroup === NutrientGroups.isoflavones ||
      nutrientGroup === NutrientGroups.proanthocyanidin;
  }

  public static isBeneficialNutrient(nutrient: FoodReportNutrient | Nutrient): boolean {
    return nutrient.name in BeneficialNutrientNames || this.isEssentialNutrient(nutrient.name) || this.isAntioxidant(nutrient.group);
  }

  public static isEssentialNutrient(nutrientName: string): boolean {
    return nutrientName in EssentialNutrientNames;
  }

  public async deleteFavoriteMeal(id: string): Promise<void> {
    return this.deleteCustomData(MEALS_PATH, MEALS_LIST_PATH, id);
  }

  public getDietChanges(): Observable<Diet> {
    return this.subscribeToDataChanges();
  }

  public getDietTrendsChanges(query: TrendsQuery): Observable<Diet[]> {
    return this.subscribeToTrendsChanges(query);
  }

  public getMealChanges(): Observable<Meal[]> {
    return this.getQueriedCollectionChanges(MEALS_PATH, MEALS_LIST_PATH);
  }

  /**
   * @desc Calculates daily nutrition requirements
   * Each nutrient requirements is multiplied by 2:
   * - not all nutrients are absorbed;
   * - the nutrient content of foods varies (storage, preparation);
   * - the standard requirements are too avoid malnutrition, not for thriving.
   * @returns {Promise<Nutrition>}
   */
  public async getRequiredNutrition(): Promise<Nutrition> {
    const userInfo: UserInfo = await this.userService.getUserInfo();
    const bodyComposition: BodyComposition = await this.bodyCompositionService.getBodyComposition();
    const movement: Movement = await this.movementService.getMovement();

    if (!userInfo || !bodyComposition) {
      return null;
    }

    const nutrition: Nutrition = {};
    const measurements: BodyMeasurements = bodyComposition.measurements;
    const energyConsumption = bodyComposition.restingMetabolicRate + (movement ? movement.energyExpenditure : 0);
    const intensePhysicalActivity = false;

    Object.keys(NutrientNames).forEach((nutrientKey: string) => {
      const nutrientName: string = NutrientNames[nutrientKey];
      const requirementMethodName = `calculate${nutrientName}Requirement`;
      Reflect.set(nutrition, nutrientName, new Nutrient('', nutrientName, 0, '', 0, null));

      if (Reflect.has(this, requirementMethodName)) {
        nutrition[nutrientName].value = this[requirementMethodName](
          userInfo,
          measurements,
          energyConsumption,
          intensePhysicalActivity
        );
      }
    });

    return nutrition;
  }

  public queryDietTrends(payload: TrendsQuery): void {
    return this.queryTrends(payload);
  }

  public queryMeals(query: string): void {
    this.queryCollection(MEALS_PATH, query);
  }

  public async saveDiet(diet: Diet): Promise<Diet> {
    return this.saveData(diet);
  }

  public async saveFavoriteMeal(meal: Meal): Promise<Meal> {
    return this.saveCustomData(MEALS_PATH, MEALS_LIST_PATH, meal);
  }

  private [`calculate${NutrientNames.Energy}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    return energyConsumption;
  }

  private [`calculate${NutrientNames['Selenium, Se']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 70;
      } else {
        return 70;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 60;
      } else {
        return 60;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 20;
      } else if (userInfo.bio.getAge() <= 3) {
        return 20;
      } else if (userInfo.bio.getAge() <= 8) {
        return 30;
      } else if (userInfo.bio.getAge() <= 13) {
        return 40;
      } else if (userInfo.bio.getAge() <= 18) {
        return 55;
      } else if (userInfo.bio.getAge() <= 30) {
        return 55;
      } else if (userInfo.bio.getAge() <= 50) {
        return 55;
      } else if (userInfo.bio.getAge() <= 70) {
        return 55;
      } else {
        return 55;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 20;
      } else if (userInfo.bio.getAge() <= 3) {
        return 20;
      } else if (userInfo.bio.getAge() <= 8) {
        return 30;
      } else if (userInfo.bio.getAge() <= 13) {
        return 40;
      } else if (userInfo.bio.getAge() <= 18) {
        return 55;
      } else if (userInfo.bio.getAge() <= 30) {
        return 55;
      } else if (userInfo.bio.getAge() <= 50) {
        return 55;
      } else if (userInfo.bio.getAge() <= 70) {
        return 55;
      } else {
        return 55;
      }
    }
  }

  private [`calculate${NutrientNames['Sodium, Na']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 1500;
      } else {
        return 1500;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 1500;
      } else {
        return 1500;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 370;
      } else if (userInfo.bio.getAge() <= 3) {
        return 1000;
      } else if (userInfo.bio.getAge() <= 8) {
        return 1200;
      } else if (userInfo.bio.getAge() <= 13) {
        return 1500;
      } else if (userInfo.bio.getAge() <= 18) {
        return 1500;
      } else if (userInfo.bio.getAge() <= 30) {
        return 1500;
      } else if (userInfo.bio.getAge() <= 50) {
        return 1500;
      } else if (userInfo.bio.getAge() <= 70) {
        return 1300;
      } else {
        return 1200;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 370;
      } else if (userInfo.bio.getAge() <= 3) {
        return 1000;
      } else if (userInfo.bio.getAge() <= 8) {
        return 1200;
      } else if (userInfo.bio.getAge() <= 13) {
        return 1500;
      } else if (userInfo.bio.getAge() <= 18) {
        return 1500;
      } else if (userInfo.bio.getAge() <= 30) {
        return 1500;
      } else if (userInfo.bio.getAge() <= 50) {
        return 1500;
      } else if (userInfo.bio.getAge() <= 70) {
        return 1300;
      } else {
        return 1200;
      }
    }
  }

  private [`calculate${NutrientNames['Sugars, total']}Requirement`](): number {
    return 25;
  }

  private [`calculate${NutrientNames['Threonine']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.03 * measurements.weight;
      } else {
        return 0.03 * measurements.weight;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.026 * measurements.weight;
      } else {
        return 0.026 * measurements.weight;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.049 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.032 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.024 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.022 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.021 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.02 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.02 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.02 * measurements.weight;
      } else {
        return 0.02 * measurements.weight;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.049 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.032 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.024 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.024 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.022 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.02 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.02 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.02 * measurements.weight;
      } else {
        return 0.02 * measurements.weight;
      }
    }
  }

  private [`calculate${NutrientNames['Tryptophan']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.009 * measurements.weight;
      } else {
        return 0.009 * measurements.weight;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.007 * measurements.weight;
      } else {
        return 0.007 * measurements.weight;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.013 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.008 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.006 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.006 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.005 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.005 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.005 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.005 * measurements.weight;
      } else {
        return 0.005 * measurements.weight;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.013 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.008 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.006 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.006 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.006 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.005 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.005 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.005 * measurements.weight;
      } else {
        return 0.005 * measurements.weight;
      }
    }
  }

  private [`calculate${NutrientNames['Valine']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.035 * measurements.weight;
      } else {
        return 0.035 * measurements.weight;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.031 * measurements.weight;
      } else {
        return 0.031 * measurements.weight;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.058 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.037 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.028 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.027 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.024 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.024 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.024 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.024 * measurements.weight;
      } else {
        return 0.024 * measurements.weight;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.058 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.037 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.028 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.028 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.027 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.024 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.024 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.024 * measurements.weight;
      } else {
        return 0.024 * measurements.weight;
      }
    }
  }

  private [`calculate${NutrientNames['Vitamin A, RAE']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 1200;
      } else {
        return 1300;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 750;
      } else {
        return 770;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 300;
      } else if (userInfo.bio.getAge() <= 3) {
        return 300;
      } else if (userInfo.bio.getAge() <= 8) {
        return 400;
      } else if (userInfo.bio.getAge() <= 13) {
        return 600;
      } else if (userInfo.bio.getAge() <= 18) {
        return 700;
      } else if (userInfo.bio.getAge() <= 30) {
        return 700;
      } else if (userInfo.bio.getAge() <= 50) {
        return 700;
      } else if (userInfo.bio.getAge() <= 70) {
        return 700;
      } else {
        return 700;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 300;
      } else if (userInfo.bio.getAge() <= 3) {
        return 300;
      } else if (userInfo.bio.getAge() <= 8) {
        return 400;
      } else if (userInfo.bio.getAge() <= 13) {
        return 600;
      } else if (userInfo.bio.getAge() <= 18) {
        return 900;
      } else if (userInfo.bio.getAge() <= 30) {
        return 900;
      } else if (userInfo.bio.getAge() <= 50) {
        return 900;
      } else if (userInfo.bio.getAge() <= 70) {
        return 900;
      } else {
        return 900;
      }
    }
  }

  private [`calculate${NutrientNames['Vitamin B12']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 2.8;
      } else {
        return 2.8;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 2.6;
      } else {
        return 2.6;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 1.2;
      } else if (userInfo.bio.getAge() <= 3) {
        return 1.8;
      } else if (userInfo.bio.getAge() <= 8) {
        return 2.4;
      } else if (userInfo.bio.getAge() <= 13) {
        return 2.4;
      } else if (userInfo.bio.getAge() <= 18) {
        return 2.4;
      } else if (userInfo.bio.getAge() <= 30) {
        return 2.4;
      } else if (userInfo.bio.getAge() <= 50) {
        return 2.4;
      } else if (userInfo.bio.getAge() <= 70) {
        return 2.4;
      } else {
        return 2.4;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 1.2;
      } else if (userInfo.bio.getAge() <= 3) {
        return 1.8;
      } else if (userInfo.bio.getAge() <= 8) {
        return 2.4;
      } else if (userInfo.bio.getAge() <= 13) {
        return 2.4;
      } else if (userInfo.bio.getAge() <= 18) {
        return 2.4;
      } else if (userInfo.bio.getAge() <= 30) {
        return 2.4;
      } else if (userInfo.bio.getAge() <= 50) {
        return 2.4;
      } else if (userInfo.bio.getAge() <= 70) {
        return 2.4;
      } else {
        return 2.4;
      }
    }
  }

  private [`calculate${NutrientNames['Thiamin']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 1.4;
      } else {
        return 1.4;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 1.4;
      } else {
        return 1.4;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.6;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.9;
      } else if (userInfo.bio.getAge() <= 18) {
        return 1;
      } else if (userInfo.bio.getAge() <= 30) {
        return 1.1;
      } else if (userInfo.bio.getAge() <= 50) {
        return 1.1;
      } else if (userInfo.bio.getAge() <= 70) {
        return 1.1;
      } else {
        return 1.1;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.6;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.9;
      } else if (userInfo.bio.getAge() <= 18) {
        return 1.2;
      } else if (userInfo.bio.getAge() <= 30) {
        return 1.2;
      } else if (userInfo.bio.getAge() <= 50) {
        return 1.2;
      } else if (userInfo.bio.getAge() <= 70) {
        return 1.2;
      } else {
        return 1.2;
      }
    }
  }

  private [`calculate${NutrientNames['Riboflavin']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 1.6;
      } else {
        return 1.6;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 1.4;
      } else {
        return 1.4;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.6;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.9;
      } else if (userInfo.bio.getAge() <= 18) {
        return 1;
      } else if (userInfo.bio.getAge() <= 30) {
        return 1.1;
      } else if (userInfo.bio.getAge() <= 50) {
        return 1.1;
      } else if (userInfo.bio.getAge() <= 70) {
        return 1.1;
      } else {
        return 1.1;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.6;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.9;
      } else if (userInfo.bio.getAge() <= 18) {
        return 1.3;
      } else if (userInfo.bio.getAge() <= 30) {
        return 1.3;
      } else if (userInfo.bio.getAge() <= 50) {
        return 1.3;
      } else if (userInfo.bio.getAge() <= 70) {
        return 1.3;
      } else {
        return 1.3;
      }
    }
  }

  private [`calculate${NutrientNames['Niacin']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 17;
      } else {
        return 17;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 18;
      } else {
        return 18;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 6;
      } else if (userInfo.bio.getAge() <= 3) {
        return 6;
      } else if (userInfo.bio.getAge() <= 8) {
        return 8;
      } else if (userInfo.bio.getAge() <= 13) {
        return 12;
      } else if (userInfo.bio.getAge() <= 18) {
        return 14;
      } else if (userInfo.bio.getAge() <= 30) {
        return 14;
      } else if (userInfo.bio.getAge() <= 50) {
        return 14;
      } else if (userInfo.bio.getAge() <= 70) {
        return 14;
      } else {
        return 14;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 6;
      } else if (userInfo.bio.getAge() <= 3) {
        return 6;
      } else if (userInfo.bio.getAge() <= 8) {
        return 8;
      } else if (userInfo.bio.getAge() <= 13) {
        return 12;
      } else if (userInfo.bio.getAge() <= 18) {
        return 16;
      } else if (userInfo.bio.getAge() <= 30) {
        return 16;
      } else if (userInfo.bio.getAge() <= 50) {
        return 16;
      } else if (userInfo.bio.getAge() <= 70) {
        return 16;
      } else {
        return 16;
      }
    }
  }

  private [`calculate${NutrientNames['Pantothenic acid']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 7;
      } else {
        return 7;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 6;
      } else {
        return 6;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 1.8;
      } else if (userInfo.bio.getAge() <= 3) {
        return 2;
      } else if (userInfo.bio.getAge() <= 8) {
        return 3;
      } else if (userInfo.bio.getAge() <= 13) {
        return 4;
      } else if (userInfo.bio.getAge() <= 18) {
        return 5;
      } else if (userInfo.bio.getAge() <= 30) {
        return 5;
      } else if (userInfo.bio.getAge() <= 50) {
        return 5;
      } else if (userInfo.bio.getAge() <= 70) {
        return 5;
      } else {
        return 5;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 1.8;
      } else if (userInfo.bio.getAge() <= 3) {
        return 2;
      } else if (userInfo.bio.getAge() <= 8) {
        return 3;
      } else if (userInfo.bio.getAge() <= 13) {
        return 4;
      } else if (userInfo.bio.getAge() <= 18) {
        return 5;
      } else if (userInfo.bio.getAge() <= 30) {
        return 5;
      } else if (userInfo.bio.getAge() <= 50) {
        return 5;
      } else if (userInfo.bio.getAge() <= 70) {
        return 5;
      } else {
        return 5;
      }
    }
  }

  private [`calculate${NutrientNames['Vitamin B6']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 2;
      } else {
        return 2;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 1.9;
      } else {
        return 1.9;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.6;
      } else if (userInfo.bio.getAge() <= 13) {
        return 1;
      } else if (userInfo.bio.getAge() <= 18) {
        return 1.2;
      } else if (userInfo.bio.getAge() <= 30) {
        return 1.3;
      } else if (userInfo.bio.getAge() <= 50) {
        return 1.3;
      } else if (userInfo.bio.getAge() <= 70) {
        return 1.5;
      } else {
        return 1.5;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.6;
      } else if (userInfo.bio.getAge() <= 13) {
        return 1;
      } else if (userInfo.bio.getAge() <= 18) {
        return 1.3;
      } else if (userInfo.bio.getAge() <= 30) {
        return 1.3;
      } else if (userInfo.bio.getAge() <= 50) {
        return 1.3;
      } else if (userInfo.bio.getAge() <= 70) {
        return 1.7;
      } else {
        return 1.7;
      }
    }
  }

  private [`calculate${NutrientNames['Folate, total']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 500;
      } else {
        return 500;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 600;
      } else {
        return 600;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 150;
      } else if (userInfo.bio.getAge() <= 3) {
        return 150;
      } else if (userInfo.bio.getAge() <= 8) {
        return 200;
      } else if (userInfo.bio.getAge() <= 13) {
        return 300;
      } else if (userInfo.bio.getAge() <= 18) {
        return 400;
      } else if (userInfo.bio.getAge() <= 30) {
        return 400;
      } else if (userInfo.bio.getAge() <= 50) {
        return 400;
      } else if (userInfo.bio.getAge() <= 70) {
        return 400;
      } else {
        return 400;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 150;
      } else if (userInfo.bio.getAge() <= 3) {
        return 150;
      } else if (userInfo.bio.getAge() <= 8) {
        return 200;
      } else if (userInfo.bio.getAge() <= 13) {
        return 300;
      } else if (userInfo.bio.getAge() <= 18) {
        return 400;
      } else if (userInfo.bio.getAge() <= 30) {
        return 400;
      } else if (userInfo.bio.getAge() <= 50) {
        return 400;
      } else if (userInfo.bio.getAge() <= 70) {
        return 400;
      } else {
        return 400;
      }
    }
  }

  private [`calculate${NutrientNames['Vitamin C, total ascorbic  acid']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 115;
      } else {
        return 120;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 80;
      } else {
        return 85;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 15;
      } else if (userInfo.bio.getAge() <= 3) {
        return 15;
      } else if (userInfo.bio.getAge() <= 8) {
        return 25;
      } else if (userInfo.bio.getAge() <= 13) {
        return 45;
      } else if (userInfo.bio.getAge() <= 18) {
        return 65;
      } else if (userInfo.bio.getAge() <= 30) {
        return 75;
      } else if (userInfo.bio.getAge() <= 50) {
        return 75;
      } else if (userInfo.bio.getAge() <= 70) {
        return 75;
      } else {
        return 75;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 15;
      } else if (userInfo.bio.getAge() <= 3) {
        return 15;
      } else if (userInfo.bio.getAge() <= 8) {
        return 25;
      } else if (userInfo.bio.getAge() <= 13) {
        return 45;
      } else if (userInfo.bio.getAge() <= 18) {
        return 75;
      } else if (userInfo.bio.getAge() <= 30) {
        return 90;
      } else if (userInfo.bio.getAge() <= 50) {
        return 90;
      } else if (userInfo.bio.getAge() <= 70) {
        return 90;
      } else {
        return 90;
      }
    }
  }

  /**
   * @desc Ideally, the body is able to create 10.000-20.000 IU/30 min sun exposure (1 IU = 0.025 ug)
   * The ability decreases with climate/weather, skin pigmentation, userInfo.bio.getAge(), and measurements.weight
   * http://health.howstuffworks.com/wellness/food-nutrition/vitamin-supplements/how-much-vitamin-d-from-sun1.htm
   */
  private [`calculate${NutrientNames['Vitamin D (D2 + D3)']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 5;
      } else {
        return 5;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 5;
      } else {
        return 5;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 5;
      } else if (userInfo.bio.getAge() <= 8) {
        return 5;
      } else if (userInfo.bio.getAge() <= 13) {
        return 5;
      } else if (userInfo.bio.getAge() <= 18) {
        return 5;
      } else if (userInfo.bio.getAge() <= 30) {
        return 5;
      } else if (userInfo.bio.getAge() <= 50) {
        return 5;
      } else if (userInfo.bio.getAge() <= 70) {
        return 10;
      } else {
        return 15;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 5;
      } else if (userInfo.bio.getAge() <= 8) {
        return 5;
      } else if (userInfo.bio.getAge() <= 13) {
        return 5;
      } else if (userInfo.bio.getAge() <= 18) {
        return 5;
      } else if (userInfo.bio.getAge() <= 30) {
        return 5;
      } else if (userInfo.bio.getAge() <= 50) {
        return 5;
      } else if (userInfo.bio.getAge() <= 70) {
        return 10;
      } else {
        return 15;
      }
    }
  }

  private [`calculate${NutrientNames['Vitamin E (alpha-tocopherol)']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 19;
      } else {
        return 19;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 15;
      } else {
        return 15;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 6;
      } else if (userInfo.bio.getAge() <= 3) {
        return 6;
      } else if (userInfo.bio.getAge() <= 8) {
        return 7;
      } else if (userInfo.bio.getAge() <= 13) {
        return 11;
      } else if (userInfo.bio.getAge() <= 18) {
        return 15;
      } else if (userInfo.bio.getAge() <= 30) {
        return 15;
      } else if (userInfo.bio.getAge() <= 50) {
        return 15;
      } else if (userInfo.bio.getAge() <= 70) {
        return 15;
      } else {
        return 15;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 6;
      } else if (userInfo.bio.getAge() <= 3) {
        return 6;
      } else if (userInfo.bio.getAge() <= 8) {
        return 7;
      } else if (userInfo.bio.getAge() <= 13) {
        return 11;
      } else if (userInfo.bio.getAge() <= 18) {
        return 15;
      } else if (userInfo.bio.getAge() <= 30) {
        return 15;
      } else if (userInfo.bio.getAge() <= 50) {
        return 15;
      } else if (userInfo.bio.getAge() <= 70) {
        return 15;
      } else {
        return 15;
      }
    }
  }

  private [`calculate${NutrientNames['Vitamin K (phylloquinone)']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 75;
      } else {
        return 90;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 75;
      } else {
        return 90;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 2.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 30;
      } else if (userInfo.bio.getAge() <= 8) {
        return 55;
      } else if (userInfo.bio.getAge() <= 13) {
        return 60;
      } else if (userInfo.bio.getAge() <= 18) {
        return 75;
      } else if (userInfo.bio.getAge() <= 30) {
        return 90;
      } else if (userInfo.bio.getAge() <= 50) {
        return 90;
      } else if (userInfo.bio.getAge() <= 70) {
        return 90;
      } else {
        return 90;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 2.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 30;
      } else if (userInfo.bio.getAge() <= 8) {
        return 55;
      } else if (userInfo.bio.getAge() <= 13) {
        return 60;
      } else if (userInfo.bio.getAge() <= 18) {
        return 75;
      } else if (userInfo.bio.getAge() <= 30) {
        return 120;
      } else if (userInfo.bio.getAge() <= 50) {
        return 120;
      } else if (userInfo.bio.getAge() <= 70) {
        return 120;
      } else {
        return 120;
      }
    }
  }

  // FIXME: Convert units
  private [`calculate${NutrientNames['Water']}Requirement`](
    userInfo: UserInfo,
    measurements: BodyMeasurements,
    intensePhysicalActivity?: boolean,
    hotWeather?: boolean
  ): number {
    return (
      measurements.weight * 0.033 * (intensePhysicalActivity ? 1.5 : 1) * 1000
    );
  }

  private [`calculate${NutrientNames['Zinc, Zn']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 13;
      } else {
        return 12;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 12;
      } else {
        return 11;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 3;
      } else if (userInfo.bio.getAge() <= 3) {
        return 3;
      } else if (userInfo.bio.getAge() <= 8) {
        return 5;
      } else if (userInfo.bio.getAge() <= 13) {
        return 8;
      } else if (userInfo.bio.getAge() <= 18) {
        return 9;
      } else if (userInfo.bio.getAge() <= 30) {
        return 8;
      } else if (userInfo.bio.getAge() <= 50) {
        return 8;
      } else if (userInfo.bio.getAge() <= 70) {
        return 8;
      } else {
        return 8;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 3;
      } else if (userInfo.bio.getAge() <= 3) {
        return 3;
      } else if (userInfo.bio.getAge() <= 8) {
        return 5;
      } else if (userInfo.bio.getAge() <= 13) {
        return 8;
      } else if (userInfo.bio.getAge() <= 18) {
        return 11;
      } else if (userInfo.bio.getAge() <= 30) {
        return 11;
      } else if (userInfo.bio.getAge() <= 50) {
        return 11;
      } else if (userInfo.bio.getAge() <= 70) {
        return 11;
      } else {
        return 11;
      }
    }
  }

  private [`calculate${NutrientNames['Manganese, Mn']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 2.6;
      } else {
        return 2.6;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 2;
      } else {
        return 2;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.6;
      } else if (userInfo.bio.getAge() <= 3) {
        return 1.2;
      } else if (userInfo.bio.getAge() <= 8) {
        return 1.5;
      } else if (userInfo.bio.getAge() <= 13) {
        return 1.6;
      } else if (userInfo.bio.getAge() <= 18) {
        return 1.6;
      } else if (userInfo.bio.getAge() <= 30) {
        return 1.8;
      } else if (userInfo.bio.getAge() <= 50) {
        return 1.8;
      } else if (userInfo.bio.getAge() <= 70) {
        return 1.8;
      } else {
        return 1.8;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.6;
      } else if (userInfo.bio.getAge() <= 3) {
        return 1.2;
      } else if (userInfo.bio.getAge() <= 8) {
        return 1.5;
      } else if (userInfo.bio.getAge() <= 13) {
        return 1.9;
      } else if (userInfo.bio.getAge() <= 18) {
        return 2.2;
      } else if (userInfo.bio.getAge() <= 30) {
        return 2.3;
      } else if (userInfo.bio.getAge() <= 50) {
        return 2.3;
      } else if (userInfo.bio.getAge() <= 70) {
        return 2.3;
      } else {
        return 2.3;
      }
    }
  }

  private [`calculate${NutrientNames['Methionine']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.026 * measurements.weight;
      } else {
        return 0.026 * measurements.weight;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.025 * measurements.weight;
      } else {
        return 0.025 * measurements.weight;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.043 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.028 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.022 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.021 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.019 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.019 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.019 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.019 * measurements.weight;
      } else {
        return 0.019 * measurements.weight;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.043 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.028 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.022 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.022 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.021 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.019 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.019 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.019 * measurements.weight;
      } else {
        return 0.019 * measurements.weight;
      }
    }
  }

  private [`calculate${NutrientNames['Molybdenum, Mo']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 50;
      } else {
        return 50;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 50;
      } else {
        return 50;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 17;
      } else if (userInfo.bio.getAge() <= 3) {
        return 17;
      } else if (userInfo.bio.getAge() <= 8) {
        return 22;
      } else if (userInfo.bio.getAge() <= 13) {
        return 34;
      } else if (userInfo.bio.getAge() <= 18) {
        return 43;
      } else if (userInfo.bio.getAge() <= 30) {
        return 45;
      } else if (userInfo.bio.getAge() <= 50) {
        return 45;
      } else if (userInfo.bio.getAge() <= 70) {
        return 45;
      } else {
        return 45;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 17;
      } else if (userInfo.bio.getAge() <= 3) {
        return 17;
      } else if (userInfo.bio.getAge() <= 8) {
        return 22;
      } else if (userInfo.bio.getAge() <= 13) {
        return 34;
      } else if (userInfo.bio.getAge() <= 18) {
        return 43;
      } else if (userInfo.bio.getAge() <= 30) {
        return 45;
      } else if (userInfo.bio.getAge() <= 50) {
        return 45;
      } else if (userInfo.bio.getAge() <= 70) {
        return 45;
      } else {
        return 45;
      }
    }
  }

  /**
   * @desc https://www.nutri-facts.org/en_US/nutrients/essential-fatty-acids/essential-fatty-acids/intake-recommendations.html
   * https://articles.mercola.com/sites/articles/archive/2016/01/04/how-much-omega-3.aspx
   */
  private [`calculate${NutrientNames['20:5 n-3 (EPA)']}Requirement`](): number {
    return 0.5;
  }

  /**
   * @desc https://www.nutri-facts.org/en_US/nutrients/essential-fatty-acids/essential-fatty-acids/intake-recommendations.html
   * https://articles.mercola.com/sites/articles/archive/2016/01/04/how-much-omega-3.aspx
   */
  private [`calculate${NutrientNames['22:6 n-3 (DHA)']}Requirement`](): number {
    return 0.5;
  }

  private [`calculate${NutrientNames['Phenylalanine']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.051 * measurements.weight;
      } else {
        return 0.051 * measurements.weight;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.044 * measurements.weight;
      } else {
        return 0.044 * measurements.weight;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.084 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.054 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.041 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.038 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.035 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.033 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.033 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.033 * measurements.weight;
      } else {
        return 0.033 * measurements.weight;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.084 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.054 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.041 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.041 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.038 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.033 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.033 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.033 * measurements.weight;
      } else {
        return 0.033 * measurements.weight;
      }
    }
  }

  private [`calculate${NutrientNames['Phosphorus, P']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 1250;
      } else {
        return 700;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 1250;
      } else {
        return 700;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 460;
      } else if (userInfo.bio.getAge() <= 3) {
        return 500;
      } else if (userInfo.bio.getAge() <= 8) {
        return 1250;
      } else if (userInfo.bio.getAge() <= 13) {
        return 1250;
      } else if (userInfo.bio.getAge() <= 18) {
        return 700;
      } else if (userInfo.bio.getAge() <= 30) {
        return 700;
      } else if (userInfo.bio.getAge() <= 50) {
        return 700;
      } else if (userInfo.bio.getAge() <= 70) {
        return 700;
      } else {
        return 700;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 460;
      } else if (userInfo.bio.getAge() <= 3) {
        return 500;
      } else if (userInfo.bio.getAge() <= 8) {
        return 1250;
      } else if (userInfo.bio.getAge() <= 13) {
        return 1250;
      } else if (userInfo.bio.getAge() <= 18) {
        return 700;
      } else if (userInfo.bio.getAge() <= 30) {
        return 700;
      } else if (userInfo.bio.getAge() <= 50) {
        return 700;
      } else if (userInfo.bio.getAge() <= 70) {
        return 700;
      } else {
        return 700;
      }
    }
  }

  private [`calculate${NutrientNames['Potassium, K']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 5100;
      } else {
        return 5100;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 4700;
      } else {
        return 4700;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 700;
      } else if (userInfo.bio.getAge() <= 3) {
        return 3000;
      } else if (userInfo.bio.getAge() <= 8) {
        return 3800;
      } else if (userInfo.bio.getAge() <= 13) {
        return 4500;
      } else if (userInfo.bio.getAge() <= 18) {
        return 4700;
      } else if (userInfo.bio.getAge() <= 30) {
        return 4700;
      } else if (userInfo.bio.getAge() <= 50) {
        return 4700;
      } else if (userInfo.bio.getAge() <= 70) {
        return 4700;
      } else {
        return 4700;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 700;
      } else if (userInfo.bio.getAge() <= 3) {
        return 3000;
      } else if (userInfo.bio.getAge() <= 8) {
        return 3800;
      } else if (userInfo.bio.getAge() <= 13) {
        return 4500;
      } else if (userInfo.bio.getAge() <= 18) {
        return 4700;
      } else if (userInfo.bio.getAge() <= 30) {
        return 4700;
      } else if (userInfo.bio.getAge() <= 50) {
        return 4700;
      } else if (userInfo.bio.getAge() <= 70) {
        return 4700;
      } else {
        return 4700;
      }
    }
  }

  private [`calculate${NutrientNames['Protein']}Requirement`](
    userInfo: UserInfo,
    measurements: BodyMeasurements,
    energyConsumption: number,
    intensePhysicalActivity?: boolean
  ): number {
    switch (userInfo.bio.constitution.dominantDosha) {
      case 'Vata-Pitta-Kapha':
        return (
          ((intensePhysicalActivity ? 0.32 : 0.27) * energyConsumption) / 4
        );

      case 'Vata-Pitta':
        return ((intensePhysicalActivity ? 0.25 : 0.2) * energyConsumption) / 4;

      case 'Pitta-Kapha':
        return (
          ((intensePhysicalActivity ? 0.38 : 0.33) * energyConsumption) / 4
        );

      case 'Vata-Kapha':
        return (
          ((intensePhysicalActivity ? 0.33 : 0.28) * energyConsumption) / 4
        );

      case 'Kapha':
        return ((intensePhysicalActivity ? 0.45 : 0.4) * energyConsumption) / 4;

      case 'Vata':
        return ((intensePhysicalActivity ? 0.2 : 0.15) * energyConsumption) / 4;

      case 'Pitta':
        return ((intensePhysicalActivity ? 0.3 : 0.25) * energyConsumption) / 4;
    }
  }

  private [`calculate${NutrientNames['Fiber, total dietary']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 29;
      } else {
        return 29;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 28;
      } else {
        return 28;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 19;
      } else if (userInfo.bio.getAge() <= 3) {
        return 19;
      } else if (userInfo.bio.getAge() <= 8) {
        return 25;
      } else if (userInfo.bio.getAge() <= 13) {
        return 26;
      } else if (userInfo.bio.getAge() <= 18) {
        return 26;
      } else if (userInfo.bio.getAge() <= 30) {
        return 25;
      } else if (userInfo.bio.getAge() <= 50) {
        return 25;
      } else if (userInfo.bio.getAge() <= 70) {
        return 21;
      } else {
        return 21;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 19;
      } else if (userInfo.bio.getAge() <= 3) {
        return 19;
      } else if (userInfo.bio.getAge() <= 8) {
        return 25;
      } else if (userInfo.bio.getAge() <= 13) {
        return 31;
      } else if (userInfo.bio.getAge() <= 18) {
        return 38;
      } else if (userInfo.bio.getAge() <= 30) {
        return 38;
      } else if (userInfo.bio.getAge() <= 50) {
        return 38;
      } else if (userInfo.bio.getAge() <= 70) {
        return 30;
      } else {
        return 30;
      }
    }
  }

  private [`calculate${NutrientNames['Histidine']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.019 * measurements.weight;
      } else {
        return 0.019 * measurements.weight;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.018 * measurements.weight;
      } else {
        return 0.018 * measurements.weight;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.032 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.021 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.016 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.015 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.014 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.014 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.014 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.014 * measurements.weight;
      } else {
        return 0.014 * measurements.weight;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.032 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.021 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.016 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.017 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.015 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.014 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.014 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.014 * measurements.weight;
      } else {
        return 0.014 * measurements.weight;
      }
    }
  }

  private [`calculate${NutrientNames['Iodine, I']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 290;
      } else {
        return 290;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 220;
      } else {
        return 220;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 90;
      } else if (userInfo.bio.getAge() <= 3) {
        return 90;
      } else if (userInfo.bio.getAge() <= 8) {
        return 120;
      } else if (userInfo.bio.getAge() <= 13) {
        return 150;
      } else if (userInfo.bio.getAge() <= 18) {
        return 150;
      } else if (userInfo.bio.getAge() <= 30) {
        return 150;
      } else if (userInfo.bio.getAge() <= 50) {
        return 150;
      } else if (userInfo.bio.getAge() <= 70) {
        return 150;
      } else {
        return 150;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 90;
      } else if (userInfo.bio.getAge() <= 3) {
        return 90;
      } else if (userInfo.bio.getAge() <= 8) {
        return 120;
      } else if (userInfo.bio.getAge() <= 13) {
        return 150;
      } else if (userInfo.bio.getAge() <= 18) {
        return 150;
      } else if (userInfo.bio.getAge() <= 30) {
        return 150;
      } else if (userInfo.bio.getAge() <= 50) {
        return 150;
      } else if (userInfo.bio.getAge() <= 70) {
        return 150;
      } else {
        return 150;
      }
    }
  }

  private [`calculate${NutrientNames['Iron, Fe']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 10;
      } else {
        return 9;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 27;
      } else {
        return 27;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 11;
      } else if (userInfo.bio.getAge() <= 3) {
        return 7;
      } else if (userInfo.bio.getAge() <= 8) {
        return 10;
      } else if (userInfo.bio.getAge() <= 13) {
        return 8;
      } else if (userInfo.bio.getAge() <= 18) {
        return 15;
      } else if (userInfo.bio.getAge() <= 30) {
        return 18;
      } else if (userInfo.bio.getAge() <= 50) {
        return 18;
      } else if (userInfo.bio.getAge() <= 70) {
        return 8;
      } else {
        return 8;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 11;
      } else if (userInfo.bio.getAge() <= 3) {
        return 7;
      } else if (userInfo.bio.getAge() <= 8) {
        return 10;
      } else if (userInfo.bio.getAge() <= 13) {
        return 8;
      } else if (userInfo.bio.getAge() <= 18) {
        return 11;
      } else if (userInfo.bio.getAge() <= 30) {
        return 8;
      } else if (userInfo.bio.getAge() <= 50) {
        return 8;
      } else if (userInfo.bio.getAge() <= 70) {
        return 8;
      } else {
        return 8;
      }
    }
  }

  private [`calculate${NutrientNames['Isoleucine']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.03 * measurements.weight;
      } else {
        return 0.03 * measurements.weight;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.025 * measurements.weight;
      } else {
        return 0.025 * measurements.weight;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.043 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.028 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.022 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.021 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.019 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.019 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.019 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.019 * measurements.weight;
      } else {
        return 0.019 * measurements.weight;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.043 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.028 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.022 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.022 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.021 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.019 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.019 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.019 * measurements.weight;
      } else {
        return 0.019 * measurements.weight;
      }
    }
  }

  private [`calculate${NutrientNames['Leucine']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.062 * measurements.weight;
      } else {
        return 0.062 * measurements.weight;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.056 * measurements.weight;
      } else {
        return 0.056 * measurements.weight;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.093 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.063 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.049 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.047 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.044 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.042 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.042 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.042 * measurements.weight;
      } else {
        return 0.042 * measurements.weight;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.093 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.063 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.049 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.049 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.047 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.042 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.042 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.042 * measurements.weight;
      } else {
        return 0.042 * measurements.weight;
      }
    }
  }

  private [`calculate${NutrientNames['Lysine']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.052 * measurements.weight;
      } else {
        return 0.052 * measurements.weight;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 0.051 * measurements.weight;
      } else {
        return 0.051 * measurements.weight;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.089 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.058 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.046 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.043 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.04 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.038 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.038 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.038 * measurements.weight;
      } else {
        return 0.038 * measurements.weight;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.089 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 3) {
        return 0.058 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 8) {
        return 0.046 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 13) {
        return 0.046 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 18) {
        return 0.043 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 30) {
        return 0.038 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 50) {
        return 0.038 * measurements.weight;
      } else if (userInfo.bio.getAge() <= 70) {
        return 0.038 * measurements.weight;
      } else {
        return 0.038 * measurements.weight;
      }
    }
  }

  private [`calculate${NutrientNames['Magnesium, Mg']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 360;
      } else if (userInfo.bio.getAge() <= 30) {
        return 310;
      } else {
        return 320;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 400;
      } else if (userInfo.bio.getAge() <= 30) {
        return 350;
      } else {
        return 360;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 80;
      } else if (userInfo.bio.getAge() <= 3) {
        return 80;
      } else if (userInfo.bio.getAge() <= 8) {
        return 130;
      } else if (userInfo.bio.getAge() <= 13) {
        return 240;
      } else if (userInfo.bio.getAge() <= 18) {
        return 360;
      } else if (userInfo.bio.getAge() <= 30) {
        return 310;
      } else if (userInfo.bio.getAge() <= 50) {
        return 320;
      } else if (userInfo.bio.getAge() <= 70) {
        return 320;
      } else {
        return 320;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 80;
      } else if (userInfo.bio.getAge() <= 3) {
        return 80;
      } else if (userInfo.bio.getAge() <= 8) {
        return 130;
      } else if (userInfo.bio.getAge() <= 13) {
        return 240;
      } else if (userInfo.bio.getAge() <= 18) {
        return 410;
      } else if (userInfo.bio.getAge() <= 30) {
        return 400;
      } else if (userInfo.bio.getAge() <= 50) {
        return 420;
      } else if (userInfo.bio.getAge() <= 70) {
        return 420;
      } else {
        return 420;
      }
    }
  }

  private [`calculate${NutrientNames['Chloride, Cl']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 2.3;
      } else {
        return 2.3;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 2.3;
      } else {
        return 2.3;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.57;
      } else if (userInfo.bio.getAge() <= 3) {
        return 1.5;
      } else if (userInfo.bio.getAge() <= 8) {
        return 1.9;
      } else if (userInfo.bio.getAge() <= 13) {
        return 2.3;
      } else if (userInfo.bio.getAge() <= 18) {
        return 2.3;
      } else if (userInfo.bio.getAge() <= 30) {
        return 2.3;
      } else if (userInfo.bio.getAge() <= 50) {
        return 2.3;
      } else if (userInfo.bio.getAge() <= 70) {
        return 2;
      } else {
        return 1.8;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.57;
      } else if (userInfo.bio.getAge() <= 3) {
        return 1.5;
      } else if (userInfo.bio.getAge() <= 8) {
        return 1.9;
      } else if (userInfo.bio.getAge() <= 13) {
        return 2.3;
      } else if (userInfo.bio.getAge() <= 18) {
        return 2.3;
      } else if (userInfo.bio.getAge() <= 30) {
        return 2.3;
      } else if (userInfo.bio.getAge() <= 50) {
        return 2.3;
      } else if (userInfo.bio.getAge() <= 70) {
        return 2;
      } else {
        return 1.8;
      }
    }
  }

  private [`calculate${NutrientNames['Choline, total']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 550;
      } else {
        return 550;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 450;
      } else {
        return 450;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 150;
      } else if (userInfo.bio.getAge() <= 3) {
        return 200;
      } else if (userInfo.bio.getAge() <= 8) {
        return 250;
      } else if (userInfo.bio.getAge() <= 13) {
        return 375;
      } else if (userInfo.bio.getAge() <= 18) {
        return 400;
      } else if (userInfo.bio.getAge() <= 30) {
        return 425;
      } else if (userInfo.bio.getAge() <= 50) {
        return 425;
      } else if (userInfo.bio.getAge() <= 70) {
        return 425;
      } else {
        return 425;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 150;
      } else if (userInfo.bio.getAge() <= 3) {
        return 200;
      } else if (userInfo.bio.getAge() <= 8) {
        return 250;
      } else if (userInfo.bio.getAge() <= 13) {
        return 375;
      } else if (userInfo.bio.getAge() <= 18) {
        return 550;
      } else if (userInfo.bio.getAge() <= 30) {
        return 550;
      } else if (userInfo.bio.getAge() <= 50) {
        return 550;
      } else if (userInfo.bio.getAge() <= 70) {
        return 550;
      } else {
        return 550;
      }
    }
  }

  private [`calculate${NutrientNames['Chromium, Cr']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 44;
      } else {
        return 45;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 29;
      } else {
        return 30;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 5.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 11;
      } else if (userInfo.bio.getAge() <= 8) {
        return 15;
      } else if (userInfo.bio.getAge() <= 13) {
        return 21;
      } else if (userInfo.bio.getAge() <= 18) {
        return 24;
      } else if (userInfo.bio.getAge() <= 30) {
        return 25;
      } else if (userInfo.bio.getAge() <= 50) {
        return 25;
      } else if (userInfo.bio.getAge() <= 70) {
        return 20;
      } else {
        return 20;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 5.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 11;
      } else if (userInfo.bio.getAge() <= 8) {
        return 15;
      } else if (userInfo.bio.getAge() <= 13) {
        return 25;
      } else if (userInfo.bio.getAge() <= 18) {
        return 35;
      } else if (userInfo.bio.getAge() <= 30) {
        return 35;
      } else if (userInfo.bio.getAge() <= 50) {
        return 35;
      } else if (userInfo.bio.getAge() <= 70) {
        return 30;
      } else {
        return 30;
      }
    }
  }

  private [`calculate${NutrientNames['Copper, Cu']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 1300;
      } else {
        return 1300;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 1000;
      } else {
        return 1000;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 340;
      } else if (userInfo.bio.getAge() <= 3) {
        return 440;
      } else if (userInfo.bio.getAge() <= 8) {
        return 700;
      } else if (userInfo.bio.getAge() <= 13) {
        return 890;
      } else if (userInfo.bio.getAge() <= 18) {
        return 900;
      } else if (userInfo.bio.getAge() <= 30) {
        return 900;
      } else if (userInfo.bio.getAge() <= 50) {
        return 900;
      } else if (userInfo.bio.getAge() <= 70) {
        return 900;
      } else {
        return 900;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 340;
      } else if (userInfo.bio.getAge() <= 3) {
        return 440;
      } else if (userInfo.bio.getAge() <= 8) {
        return 700;
      } else if (userInfo.bio.getAge() <= 13) {
        return 890;
      } else if (userInfo.bio.getAge() <= 18) {
        return 900;
      } else if (userInfo.bio.getAge() <= 30) {
        return 900;
      } else if (userInfo.bio.getAge() <= 50) {
        return 900;
      } else if (userInfo.bio.getAge() <= 70) {
        return 900;
      } else {
        return 900;
      }
    }
  }

  private [`calculate${NutrientNames['Total lipid (fat)']}Requirement`](
    userInfo: UserInfo,
    measurements: BodyMeasurements,
    energyConsumption: number,
    intensePhysicalActivity?: boolean
  ): number {
    switch (userInfo.bio.constitution.dominantDosha) {
      case 'Vata-Pitta-Kapha':
        return (
          ((intensePhysicalActivity ? 0.18 : 0.33) * energyConsumption) / 9
        );

      case 'Vata-Pitta':
        return ((intensePhysicalActivity ? 0.15 : 0.3) * energyConsumption) / 9;

      case 'Pitta-Kapha':
        return (
          ((intensePhysicalActivity ? 0.22 : 0.37) * energyConsumption) / 9
        );

      case 'Vata-Kapha':
        return (
          ((intensePhysicalActivity ? 0.17 : 0.32) * energyConsumption) / 9
        );

      case 'Kapha':
        return ((intensePhysicalActivity ? 0.25 : 0.4) * energyConsumption) / 9;

      case 'Vata':
        return ((intensePhysicalActivity ? 0.1 : 0.25) * energyConsumption) / 9;

      case 'Pitta':
        return ((intensePhysicalActivity ? 0.2 : 0.35) * energyConsumption) / 9;
    }
  }

  /**
   * @desc https://www.nutri-facts.org/en_US/nutrients/essential-fatty-acids/essential-fatty-acids/intake-recommendations.html
   */
  private [`calculate${NutrientNames['18:2 undifferentiated']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    return this[`calculate${NutrientNames['18:3 n-3 c,c,c (ALA)']}Requirement`](userInfo) * 2;
  }

  /**
   * @desc https://www.nutri-facts.org/en_US/nutrients/essential-fatty-acids/essential-fatty-acids/intake-recommendations.html
   */
  private [`calculate${NutrientNames['18:3 n-3 c,c,c (ALA)']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      return 13;
    } else if (userInfo.bio.motherHood === 'pregnant') {
      return 13;
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 4.6;
      } else if (userInfo.bio.getAge() <= 8) {
        return 7;
      } else if (userInfo.bio.getAge() <= 13) {
        return 10;
      } else if (userInfo.bio.getAge() <= 18) {
        return 10;
      } else {
        return 12;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 0.5;
      } else if (userInfo.bio.getAge() <= 3) {
        return 4.6;
      } else if (userInfo.bio.getAge() <= 8) {
        return 7;
      } else if (userInfo.bio.getAge() <= 13) {
        return 10;
      } else if (userInfo.bio.getAge() <= 18) {
        return 12;
      } else if (userInfo.bio.getAge() <= 30) {
        return 16;
      } else {
        return 17;
      }
    }
  }

  private [`calculate${NutrientNames['Biotin']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      return 35;
    } else if (userInfo.bio.motherHood === 'pregnant') {
      return 30;
    } else if (userInfo.bio.getAge() <= 1) {
      return 6;
    } else if (userInfo.bio.getAge() <= 3) {
      return 8;
    } else if (userInfo.bio.getAge() <= 8) {
      return 12;
    } else if (userInfo.bio.getAge() <= 13) {
      return 20;
    } else if (userInfo.bio.getAge() <= 18) {
      return 25;
    } else if (userInfo.bio.getAge() <= 30) {
      return 30;
    } else if (userInfo.bio.getAge() <= 50) {
      return 30;
    } else if (userInfo.bio.getAge() <= 70) {
      return 30;
    } else {
      return 30;
    }
  }

  private [`calculate${NutrientNames['Calcium, Ca']}Requirement`](
    userInfo: UserInfo,
    measurements?: BodyMeasurements,
    energyConsumption?: number,
    intensePhysicalActivity?: boolean
  ): number {
    if (userInfo.bio.motherHood === 'lactating') {
      if (userInfo.bio.getAge() <= 18) {
        return 1300;
      } else {
        return 1000;
      }
    } else if (userInfo.bio.motherHood === 'pregnant') {
      if (userInfo.bio.getAge() <= 18) {
        return 1300;
      } else {
        return 1000;
      }
    } else if (userInfo.bio.gender === 'female') {
      if (userInfo.bio.getAge() <= 1) {
        return 270;
      } else if (userInfo.bio.getAge() <= 3) {
        return 500;
      } else if (userInfo.bio.getAge() <= 8) {
        return 800;
      } else if (userInfo.bio.getAge() <= 13) {
        return 1300;
      } else if (userInfo.bio.getAge() <= 18) {
        return 1300;
      } else if (userInfo.bio.getAge() <= 30) {
        return 1000;
      } else if (userInfo.bio.getAge() <= 50) {
        return 1000;
      } else if (userInfo.bio.getAge() <= 70) {
        return 1200;
      } else {
        return 1200;
      }
    } else {
      if (userInfo.bio.getAge() <= 1) {
        return 270;
      } else if (userInfo.bio.getAge() <= 3) {
        return 500;
      } else if (userInfo.bio.getAge() <= 8) {
        return 800;
      } else if (userInfo.bio.getAge() <= 13) {
        return 1300;
      } else if (userInfo.bio.getAge() <= 18) {
        return 1300;
      } else if (userInfo.bio.getAge() <= 30) {
        return 1000;
      } else if (userInfo.bio.getAge() <= 50) {
        return 1000;
      } else if (userInfo.bio.getAge() <= 70) {
        return 1200;
      } else {
        return 1200;
      }
    }
  }

  private [`calculate${NutrientNames['Carbohydrate, by difference']}Requirement`](
    userInfo: UserInfo,
    measurements: BodyMeasurements,
    energyConsumption: number,
    intensePhysicalActivity?: boolean
  ): number {
    switch (userInfo.bio.constitution.dominantDosha) {
      case 'Vata-Pitta-Kapha':
        return ((intensePhysicalActivity ? 0.5 : 0.4) * energyConsumption) / 4;

      case 'Vata-Pitta':
        return ((intensePhysicalActivity ? 0.6 : 0.5) * energyConsumption) / 4;

      case 'Pitta-Kapha':
        return ((intensePhysicalActivity ? 0.4 : 0.3) * energyConsumption) / 4;

      case 'Vata-Kapha':
        return ((intensePhysicalActivity ? 0.5 : 0.4) * energyConsumption) / 4;

      case 'Kapha':
        return ((intensePhysicalActivity ? 0.3 : 0.2) * energyConsumption) / 4;

      case 'Vata':
        return ((intensePhysicalActivity ? 0.7 : 0.6) * energyConsumption) / 4;

      case 'Pitta':
        return ((intensePhysicalActivity ? 0.5 : 0.4) * energyConsumption) / 4;
    }
  }
}
