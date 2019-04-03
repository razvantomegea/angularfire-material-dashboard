import { Nutrition, NutritionMetrics } from 'app/dashboard/nutrition/model';

export interface USDAFoodReportResponse {
  api: number;
  count: number;
  foods: { food: FoodReport }[];
  notfound: number;
}

export interface FoodReportDescription {
  cf?: number;
  cn?: string;
  ds?: string;
  ff?: number;
  fg: string;
  manu: string;
  name: string;
  ndbno?: string;
  nf?: number;
  pf?: number;
  r?: string;
  rd?: string;
  ru: string;
  sd?: string;
  sn?: string;
}

export interface Measure {
  eqv: number;
  eunit: string;
  label: string;
  qty: number;
  value: number;
}

export interface FoodReportNutrient {
  derivation: string;
  dp: number;
  group: string;
  measures: Measure[];
  name: string;
  nutrient_id: number;
  se: string;
  sourcecode: number[];
  unit: string;
  value: number;
}

export interface FoodSource {
  authors: string;
  id: number;
  iss: string;
  title: string;
  vol: string;
  year: string;
}

export interface Langual {
  desc: string;
  id: string;
}

export interface FoodIngredient {
  desc: string;
  uptd: string;
}

/**
 * @classdesc https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORTV2.md
 */
export interface FoodReport {
  desc: FoodReportDescription;
  footnotes?: any[];
  ing?: FoodIngredient[];
  langual?: Langual[];
  metrics: NutritionMetrics;
  nutrients: FoodReportNutrient[];
  nutrition: Nutrition;
  quantity: number;
  sources?: FoodSource[];
  sr?: string;
  unit: string;
  type?: string;
}


