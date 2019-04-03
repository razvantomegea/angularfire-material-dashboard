export class USDANutrientReportQueryParams {
  /**
   * @param {string[]} nutrients - Food report ID
   * @param {string[]} fg - Limit your nutrients to one or more food groups by providing a list of food group ID's via the fg parameter.
   * The default is a blank list meaning no food group filtering will be applied. Up to 10 food groups may be specified.
   * @param {string[]} nbno - Report the nutrients for a single food identified by it's unique id -- nutrient number
   * @param {string} sort - Sort the list of foods by (f)ood name or nutrient (c)ontent.
   * If you are requesting more than one nutrient and specifying sort = c then the first nutrient in your list is used for the content sort.
   * @param {number} max - Number of rows to return. The maximum per request is 1,500.
   * @param {number} offset - Beginning row in the result set to begin
   * @param {number} subset - You may indicate all the foods in the SR database or an abridged list from the pull down menu.
   * Set the subset parameter to 1 for the abridged list of about 1,000 foods commonly consumed in the U.S.
   * The default 0 for all of the foods in the database
   * @param {string} format - Results format: json or xml
   */
  constructor(
    public nutrients: string[],
    public fg: string[] = [],
    public nbno: string[] = [],
    public sort: string = 'c',
    public max: number = 100,
    public offset: number = 0,
    public subset: number = 0,
    public format = 'json'
  ) {
  }
}
