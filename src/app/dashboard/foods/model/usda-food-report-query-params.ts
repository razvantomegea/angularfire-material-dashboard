export class USDAFoodReportQueryParams {
  /**
   * @param {string} ndbno - Food report ID
   * @param {string} type - Report type: [b]asic or [f]ull or [s]tats
   * @param {string} format - Results format: json or xml
   */
  constructor(
    public ndbno: string = '',
    public type: string = 'f',
    public format: string = 'json'
  ) {
  }
}
