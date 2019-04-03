import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FoodReportNutrient } from 'app/dashboard/foods/model';
import {
  BeneficialNutrientNames,
  EssentialNutrientNames,
  MacronutrientNames,
  Nutrient,
  NutrientGroups,
  Nutrition,
  USDANutrient
} from 'app/dashboard/nutrition/model';
import { NutritionService } from 'app/dashboard/nutrition/services/nutrition.service';

interface NutrientGroup {
  name: string;
  nutrients: Nutrient[];
}

@Component({
  selector: 'app-nutrition-details',
  templateUrl: './nutrition-details.component.html',
  styleUrls: ['./nutrition-details.component.scss']
})
export class NutritionDetailsComponent implements OnChanges {
  public isOverflown = false;
  public nutrientGroups: NutrientGroup[];
  public nutrients: Nutrient[] = [];
  @Input() private completedNutrition: Nutrition;
  @Input() private fullNutrition: boolean;
  @Input() private remainingNutrition: Nutrition;
  @Input() private usdaNutrients: USDANutrient[];

  public ngOnChanges(changes: SimpleChanges): void {
    this.clearNutrients();
    this.setupUsdaNutrients();

    if ((changes.completedNutrition || changes.remainingNutrition) && !!this.completedNutrition && !!this.remainingNutrition) {
      this.setupNutrition();
    }
  }

  public onMouseEnter(event: Event): void {
    const nodeEl: HTMLElement = <HTMLElement>event.target;
    this.isOverflown = nodeEl.scrollWidth > nodeEl.offsetWidth || nodeEl.scrollHeight > nodeEl.offsetHeight;
  }

  private classifyNutrient(nutrient: Nutrient): void {
    const nutrientGroup: NutrientGroup = this.nutrientGroups.find((group: NutrientGroup) => group.name === nutrient.group);

    if (!nutrientGroup.nutrients.find((p: Nutrient) => p.name === nutrient.name)) {
      nutrientGroup.nutrients.push(nutrient);
    }

    this.nutrients = this.nutrientGroups.reduce((acc: Nutrient[], curr: NutrientGroup) => acc = <Nutrient[]>[
      ...acc,
      ...curr.nutrients
    ], []);
  }

  private clearNutrients() {
    this.nutrients = [];
    this.nutrientGroups = [
      {
        name: NutrientGroups.proximates,
        nutrients: []
      },
      {
        name: NutrientGroups.aminoAcids,
        nutrients: []
      },
      {
        name: NutrientGroups.minerals,
        nutrients: []
      },
      {
        name: NutrientGroups.vitamins,
        nutrients: []
      },
      {
        name: NutrientGroups.lipids,
        nutrients: []
      },
      {
        name: NutrientGroups.polyphenols,
        nutrients: []
      },
      {
        name: NutrientGroups.other,
        nutrients: []
      }
    ];
  }

  private setupNutrition(): void {
    for (const nutrientKey in this.completedNutrition) {
      if (Reflect.has(this.remainingNutrition, nutrientKey)) {
        const n: FoodReportNutrient | Nutrient = this.completedNutrition[nutrientKey];
        const mappedName: string = EssentialNutrientNames[n.name] || BeneficialNutrientNames[n.name] ||
          MacronutrientNames[n.name];
        const nutrientIndex: number = this.nutrients.findIndex((nutrient: Nutrient) => nutrient.name === mappedName || nutrient.name ===
          n.name);

        if (nutrientIndex !== -1) {
          const percentage: number = this.remainingNutrition[nutrientKey].value;
          const nutrient: Nutrient = this.nutrients[nutrientIndex];
          this.updateNutrientValue(nutrient, n.value, n.unit, percentage);
          nutrient.percentage = percentage;
          nutrient.unit = n.unit;
          nutrient.value = n.value;
        }
      }
    }
  }

  private setupUsdaNutrients(): void {
    if (!this.nutrients.length && this.usdaNutrients) {
      this.usdaNutrients.forEach((n: USDANutrient) => {
        const nutrientGroup: string = NutritionService.getNutrientGroup(n.id);
        const mappedName: string = EssentialNutrientNames[n.name] || BeneficialNutrientNames[n.name] ||
          MacronutrientNames[n.name];

        if (mappedName || nutrientGroup === NutrientGroups.polyphenols || this.fullNutrition) {
          const nutrient: Nutrient = new Nutrient(
            nutrientGroup,
            mappedName || n.name,
            0,
            '',
            0,
            parseInt(n.id, 10)
          );

          this.classifyNutrient(nutrient);
        }
      });
    }
  }

  private updateNutrientValue(nutrient: Nutrient, value: number, unit: string, percentage: number): void {
    const nutrientGroup: NutrientGroup = this.nutrientGroups.find((group: NutrientGroup) => group.name === nutrient.group);

    if (nutrientGroup) {
      const n: Nutrient = nutrientGroup.nutrients.find((p: Nutrient) => p.name === nutrient.name);

      if (n) {
        n.value = value;
        n.unit = unit;
        n.percentage = percentage;
      }
    }
  }
}
