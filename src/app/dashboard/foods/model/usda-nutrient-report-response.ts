export interface USDANutrientReportResponse {
  report: NutrientReport;
  foods?: FoodSort[];
}

export interface FoodSortNutrient {
  gm: number;
  nutrient: string;
  nutrient_id: string;
  unit: string;
  value: string;
}

export interface FoodSort {
  measure: string;
  name: string;
  ndbno: string;
  nutrients: FoodSortNutrient[];
  weight: number;
}

/**
 * @classdesc https://ndb.nal.usda.gov/ndb/doc/apilist/NUTRIENT-REPORT.md
 */
export interface NutrientReport {
  end: number;
  foods: FoodSort[];
  groups: string;
  sr: string;
  start: number;
  subset: string;
  total: number;
}

