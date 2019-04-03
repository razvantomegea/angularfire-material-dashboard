import { NutrientGroups } from 'app/dashboard/nutrition/model/nutrient-groups.enum';
import { NutrientNames } from 'app/dashboard/nutrition/model/nutrient-names.enum';

export class Nutrient {
  constructor(
    public group: string,
    public name: string,
    public percentage: number,
    public unit: string,
    public value: number,
    public nutrient_id: number,
    public isEssential?: boolean,
    public isBeneficial?: boolean
  ) {
    switch (this.group) {
      case NutrientGroups.proximates:
      case NutrientGroups.lipids:
      case NutrientGroups.aminoAcids:
        this.unit = this.unit || 'g';
        break;

      case NutrientGroups.minerals:
      case NutrientGroups.vitamins:
      case NutrientGroups.polyphenols:
      case NutrientGroups.other:
        this.unit = this.unit || 'mg';
        break;
    }

    switch (this.name) {
      case NutrientNames.Energy:
        this.unit = 'kcal';
        break;

      case NutrientNames.Water:
        this.unit = 'ml';
        break;

      case NutrientNames['Selenium, Se']:
      case NutrientNames['Folic acid']:
      case NutrientNames['Vitamin A, RAE']:
      case NutrientNames['Vitamin D (D2 + D3)']:
      case NutrientNames['Vitamin K (phylloquinone)']:
      case NutrientNames.Lycopene:
        this.unit = 'µg';
        break;
    }
  }

  public getData(): string {
    return !!this.unit ? `${(this.value || 0).toFixed(1)}${this.unit} (${this.percentage}%)` : `${this.percentage}%`;
  }
}


