export class USDAListQueryParams {
  /**
   * @param {string} lt - list type(lt)
   * d = derivation codes, f = food , n = all nutrients, ns = speciality nutrients, nr = standard release nutrients only,g = food group
   * @param {string} sort - sort order
   * n=name or id
   * (Meaning of id varies by list type: nutrient number for a nutrient list, NDBno for a foods list ,food group id for a food group list)
   * @param {number} max - Maximum rows to return
   * @param {number} offset - Beginning row in the result set to begin
   * @param {string} format - Results format: json or xml
   */
  constructor(
    public lt: string = 'n',
    public sort: string = 'i',
    public max: number = 200,
    public offset: number = 0,
    public format = 'json'
  ) {
  }
}
