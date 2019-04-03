export interface USDASearchResponse {
  list: USDASearchResponseList;
  errors?: {error: Error};
}

export interface FoodSearch {
  ds: string;
  group: string;
  manu: string;
  name: string;
  ndbno: string;
  offset: number;
}

export interface USDASearchResponseList {
  ds: string;
  end: number;
  group: string;
  item: FoodSearch[];
  q: string;
  sort: string;
  sr: string;
  start: number;
  total: number;
}




