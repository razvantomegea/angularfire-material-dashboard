export class USDASearchQueryParams {
  /**
   * @param {string} q - Include foods which contain all of these words
   * @param {string} fg - Food group ID
   * @param {string} ds - Data source. Must be either 'Branded Food Products' or 'Standard Reference'
   * @param {string} sort - Sort the results by food name (n) or by search relevance (r)
   * @param {number} max - Maximum rows to return
   * @param {number} offset - Beginning row in the result set to begin
   * @param {string} format - Results format: json or xml
   */
  constructor(
    public q: string = '',
    public fg: string = '',
    public ds: string = '',
    public sort: string = 'n',
    public max: number = 50,
    public offset: number = 0,
    public format = 'json'
  ) {}
}
