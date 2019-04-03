export interface USDAListResponse {
  list: USDAListResponseData;
  errors?: {error: Error};
}

export class USDANutrient {
  id: string;
  name: string;
  offset: number;
}

export interface USDAListResponseData {
  end: number;
  item: USDANutrient[];
  lt: string;
  sort: string;
  sr: number;
  start: number;
  total: number;
}
