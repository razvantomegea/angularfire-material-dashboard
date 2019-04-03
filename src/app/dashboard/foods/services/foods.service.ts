import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { HttpParamsOptions } from '@angular/common/http/src/params';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Food } from 'app/dashboard/foods/model/food';
import { NutritionService } from 'app/dashboard/nutrition/services/nutrition.service';
import { DataService } from 'app/shared/mixins';
import { orderBy } from 'app/shared/utils/lodash-exports';
import { map, Observable } from 'app/shared/utils/rxjs-exports';
import { Nutrient, NutrientNames, Nutrition, NutritionMetrics } from '../../nutrition/model';
import {
  FoodReport,
  FoodReportNutrient,
  FoodSearch,
  FoodSort,
  USDA,
  USDAFoodReportQueryParams,
  USDAFoodReportResponse,
  USDAListQueryParams,
  USDAListResponse,
  USDANutrient,
  USDANutrientReportQueryParams,
  USDANutrientReportResponse,
  USDASearchQueryParams,
  USDASearchResponse
} from '../model';

const FOOD_COLLECTION = 'foods';
const FOOD_COLLECTION_LIST = 'list';

@Injectable({
  providedIn: 'root'
})
export class FoodsService extends DataService<Food[]> {
  constructor(protected afAuth: AngularFireAuth, protected afs: AngularFirestore, private http: HttpClient) {
    super(afAuth, afs, FOOD_COLLECTION, true, FOOD_COLLECTION_LIST);
  }

  public async deleteFood(foodId: string): Promise<void> {
    return this.deleteCustomData(FOOD_COLLECTION, FOOD_COLLECTION_LIST, foodId);
  }

  public getFoodChanges(): Observable<Food[]> {
    return this.getQueriedCollectionChanges(FOOD_COLLECTION, FOOD_COLLECTION_LIST, 'desc.name');
  }

  /**
   * @desc Calls USDA Food Report V2 API
   * @desc https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORTV2.md
   * @param {USDAFoodReportQueryParams} reportQueryParams
   */
  public getUSDAFoodReport(reportQueryParams: USDAFoodReportQueryParams): Observable<FoodReport> {
    // All white spaces must be replaced with '+' separator
    const queryParams: HttpParams = new HttpParams(<HttpParamsOptions>{
      fromObject: {
        api_key: USDA.API_KEY,
        ndbno: reportQueryParams.ndbno,
        type: reportQueryParams.type,
        format: reportQueryParams.format
      }
    });

    // TODO: Multiple units based on nutrient measures
    return this.http.get(`${USDA.API_URL}/V2/reports`, { observe: 'response', params: queryParams })
      .pipe(map((response: HttpResponse<USDAFoodReportResponse>) => {
        if (response && response.status === 200) {
          const foodReport: FoodReport = <FoodReport>response.body.foods[0].food;

          if (!foodReport) {
            return null;
          }

          const foodNutrition: Nutrition = this.mapFoodNutrition(foodReport);
          const foodMetrics: NutritionMetrics = this.calculateFoodNutritionMetrics(foodNutrition);

          return Object.assign({}, foodReport, { nutrition: foodNutrition, metrics: foodMetrics, quantity: 100, unit: 'g' });
        }
      }));
  }

  /**
   * @desc Calls USDA List API
   * @desc https://ndb.nal.usda.gov/ndb/doc/apilist/API-LIST.md
   * @param {USDANutrientReportQueryParams} reportQueryParams
   */
  public getUSDAList(reportQueryParams: USDAListQueryParams): Observable<USDANutrient[]> {
    // All white spaces must be replaced with '+' separator
    const queryParams: HttpParams = new HttpParams(<HttpParamsOptions>{
      fromObject: {
        api_key: USDA.API_KEY,
        lt: reportQueryParams.lt,
        sort: reportQueryParams.sort,
        max: `${reportQueryParams.max}`,
        offset: `${reportQueryParams.offset}`,
        format: reportQueryParams.format
      }
    });

    return this.http.get(`${USDA.API_URL}/list`, { observe: 'response', params: queryParams })
      .pipe(map((response: HttpResponse<USDAListResponse>) => {
        if (response && response.status === 200) {
          const { body } = response;

          if (Reflect.has(body, 'errors')) {
            throw body.errors.error[0].message;
          }

          return <USDANutrient[]>body.list.item;
        }
      }));
  }

  /**
   * @desc Calls USDA Nutrient Report API (Foods sorted by nutrients)
   * @desc https://ndb.nal.usda.gov/ndb/doc/apilist/API-NUTRIENT-REPORT.md
   * @param {USDANutrientReportQueryParams} reportQueryParams
   */
  public getUSDANutrientReports(reportQueryParams: USDANutrientReportQueryParams): Observable<FoodSort[]> {
    // All white spaces must be replaced with '+' separator
    const queryParams: HttpParams = new HttpParams(<HttpParamsOptions>{
      fromObject: {
        api_key: USDA.API_KEY,
        nutrients: reportQueryParams.nutrients.join('&'),
        fg: reportQueryParams.fg.join('&'),
        nbno: reportQueryParams.nbno.join('&'),
        sort: reportQueryParams.sort,
        max: `${reportQueryParams.max}`,
        offset: `${reportQueryParams.offset}`,
        subset: `${reportQueryParams.subset}`,
        format: reportQueryParams.format
      }
    });

    return this.http.get(`${USDA.API_URL}/nutrients`, { observe: 'response', params: queryParams })
      .pipe(map((response: HttpResponse<USDANutrientReportResponse>) => {
        if (response && response.status === 200) {
          const body: USDANutrientReportResponse = response.body;
          return body.report ? orderBy(body.report.foods, ['nutrients[0].gm'], ['desc']) : body.foods;
        }
      }));
  }

  public queryFoods(query: string): void {
    this.queryCollection(FOOD_COLLECTION, query);
  }

  public async saveFood(food: Food): Promise<Food> {
    return this.saveCustomData(FOOD_COLLECTION, FOOD_COLLECTION_LIST, food);
  }

  /**
   * @desc Calls USDA Food search API
   * @desc https://ndb.nal.usda.gov/ndb/doc/apilist/API-SEARCH.md
   * @param {USDASearchQueryParams} searchQueryParams
   */
  public searchUSDAFoods(searchQueryParams: USDASearchQueryParams): Observable<FoodSearch[]> {
    // All white spaces must be replaced with '+' separator
    const queryParams: HttpParams = new HttpParams(<HttpParamsOptions>{
      fromObject: {
        api_key: USDA.API_KEY,
        q: searchQueryParams.q.split(' ').join('+'),
        ds: searchQueryParams.ds.split(' ').join('+'),
        fg: searchQueryParams.fg,
        sort: searchQueryParams.sort,
        max: `${searchQueryParams.max}`,
        offset: `${searchQueryParams.offset}`,
        format: searchQueryParams.format
      }
    });

    return this.http.get(`${USDA.API_URL}/search`, { observe: 'response', params: queryParams })
      .pipe(map((response: HttpResponse<USDASearchResponse>) => {
        if (response && response.status === 200) {
          const { body } = response;

          if (Reflect.has(body, 'errors')) {
            throw body.errors.error[0].message;
          }

          return <FoodSearch[]>body.list.item;
        }
      }));
  }

  private calculateFoodNutritionMetrics(nutrition: Nutrition): NutritionMetrics {
    const fullnessFactor: number = NutritionService.calculateFullnessFactor(nutrition);
    const insulinLoad: number = NutritionService.calculateInsulinLoad(nutrition);
    const foodScore: number = NutritionService.calculateNutritionScore(nutrition);
    const thermicEffect: number = NutritionService.calculateThermicEffect(nutrition);
    nutrition[NutrientNames.Energy].value = nutrition[NutrientNames.Energy].value - thermicEffect;

    return new NutritionMetrics(fullnessFactor, insulinLoad, foodScore, thermicEffect);
  }

  /**
   * @desc Maps an array of nutrients to nutrition object
   * @param {FoodReport} food
   * @returns {Nutrition}
   */
  private mapFoodNutrition(food: FoodReport): Nutrition {
    const nutrition: Nutrition = {};

    food.nutrients.forEach((nutrient: FoodReportNutrient) => {
      const isAntioxidant: boolean = NutritionService.isAntioxidant(nutrient.group);

      if (nutrient.name in NutrientNames) {
        const nutrientName: string = NutrientNames[nutrient.name];
        const isEssential: boolean = NutritionService.isEssentialNutrient(nutrient.name);
        const isBeneficial: boolean = NutritionService.isBeneficialNutrient(nutrient);

        if (!Reflect.has(nutrition, nutrientName)) {
          Reflect.set(
            nutrition,
            nutrientName,
            new Nutrient(nutrient.group, nutrientName, 0, nutrient.unit, nutrient.value, nutrient.nutrient_id, isEssential, isBeneficial)
          );
        }
      } else if (!Reflect.has(nutrition, nutrient.name)) {
        Reflect.set(
          nutrition,
          nutrient.name,
          new Nutrient(nutrient.group, nutrient.name, 0, nutrient.unit, nutrient.value, nutrient.nutrient_id, false, isAntioxidant)
        );
      }
    });

    Reflect.deleteProperty(food, 'nutrients');

    return nutrition;
  }
}
