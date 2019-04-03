import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { RoutingStateService } from 'app/core/services';
import { Food, FoodDescription, USDAFoodGroups, USDAListQueryParams, USDANutrient } from 'app/dashboard/foods/model';
import { DeleteFood, GetNutrients, SaveFood, SelectFood } from 'app/dashboard/foods/store/actions/foods.actions';
import { Nutrient, NutrientNames, NutritionMetrics } from 'app/dashboard/nutrition/model';
import { NutritionService } from 'app/dashboard/nutrition/services/nutrition.service';
import { DynamicFormConfig, DynamicFormFieldTypes, DynamicFormSelectConfig } from 'app/shared/components/dynamic-form';
import { ComponentDestroyed } from 'app/shared/mixins';
import { uniqBy, values } from 'app/shared/utils/lodash-exports';
import { Observable, takeUntil } from 'app/shared/utils/rxjs-exports';
import * as fromFoods from '../store/reducers';

class FoodDescriptionFormValue {
  constructor(
    public fg: string,
    public manu: string,
    public name: string
  ) {
  }
}

@Component({
  selector: 'app-food-edit',
  templateUrl: './food-edit.component.html',
  styleUrls: ['./food-edit.component.scss']
})
export class FoodEditComponent extends ComponentDestroyed implements OnInit {
  public readonly foodId: string;
  public readonly nutrientGroups: any[] = [];
  public foodDescriptionForm: FormGroup = new FormGroup({});
  public foodNutritionForm: FormGroup;
  public formConfigs: DynamicFormConfig[];
  public initialFormData: FoodDescriptionFormValue;
  public nutrients: USDANutrient[];
  private readonly food$: Observable<Food> = this.store.pipe(
    select(fromFoods.getSelectedFood),
    takeUntil(this.isDestroyed$)
  );
  private readonly foodGroups: string[];
  private readonly nutrients$: Observable<USDANutrient[]> = this.store.pipe(
    select(fromFoods.getNutrients),
    takeUntil(this.isDestroyed$)
  );
  private food: Food;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routingStateService: RoutingStateService,
    private store: Store<fromFoods.FoodsState>
  ) {
    super();
    this.foodId = this.activatedRoute.snapshot.params.id;
    this.foodGroups = values(USDAFoodGroups);
    this.setupForm();
    // this.nutrientGroups = values(NutrientGroups).map((group: string) => ({ name: group, nutrients: [] }));
    this.setupFood();
  }

  public ngOnInit(): void {
    if (!this.routingStateService.getPreviousUrl().includes('foods')) {
      this.store.dispatch(new GetNutrients(new USDAListQueryParams()));
    }

    if (this.foodId) {
      this.store.dispatch(new SelectFood(this.foodId));
      this.food$.subscribe((food: Food) => {
        if (!!food) {
          this.setupFood(food);
        }
      });
    }

    this.nutrients$.subscribe((nutrients: USDANutrient[]) => {
      if (nutrients && nutrients.length) {
        this.nutrients = uniqBy([...nutrients].map((nutrient: USDANutrient) => ({
          ...nutrient,
          name: NutrientNames[nutrient.name] || nutrient.name
        })), 'name');
        this.nutrients.forEach((nutrient: USDANutrient) => {
          const nutrientGroup: string = NutritionService.getNutrientGroup(nutrient.id);
          const nutrientGroupIndex: number = this.nutrientGroups.findIndex(group => group.name === nutrientGroup);

          if (nutrientGroupIndex !== -1) {
            this.nutrientGroups[nutrientGroupIndex].nutrients.push(nutrient);
          } else {
            this.nutrientGroups.push({
              name: nutrientGroup,
              nutrients: [nutrient]
            });
          }
        });
        this.setupNutrientsForm();
      }
    });
  }

  public onCancel(): void {
    this.router.navigate(['foods']);
  }

  public onDelete(): void {
    this.store.dispatch(new DeleteFood((<Food>this.food).id));
    this.onCancel();
  }

  public onFormCreated(form: FormGroup): void {
    this.foodDescriptionForm = form;
  }

  public onFormValueChanges(changes: FoodDescriptionFormValue): void {
    if (this.foodDescriptionForm.valid) {
      this.food.desc = new FoodDescription(changes.fg, changes.name, changes.manu, '');
    }
  }

  public onSubmit(): void {
    if (this.foodDescriptionForm.valid) {
      Object.keys(this.foodNutritionForm.value).forEach((key: string) => {
        this.assignNutrient(key, parseInt(this.foodNutritionForm.value[key], 10));
      });
      this.store.dispatch(new SaveFood(this.food));
      this.onCancel();
    }
  }

  private assignNutrient(name: string, value: number): void {
    if (!Reflect.has(this.food.nutrition, name)) {
      const nutrient: USDANutrient = this.nutrients.find((n: USDANutrient) => n.name === name);
      const nutrientGroup: string = NutritionService.getNutrientGroup(nutrient.id);
      Reflect.set(this.food.nutrition, name, new Nutrient(
        nutrientGroup,
        nutrient.name,
        0,
        '',
        this.foodNutritionForm.value[name],
        parseInt(nutrient.id, 10)
      ));
    }

    this.food.nutrition[name].value = this.foodNutritionForm.value[name] || 0;
  }

  private setupFood(food?: Food): void {
    this.food = food ? new Food(
      new FoodDescription(food.desc.fg, food.desc.name, food.desc.manu, food.desc.ru),
      food.metrics,
      food.nutrition,
      food.quantity,
      food.unit
    ) : new Food(new FoodDescription('', '', '', ''), new NutritionMetrics(), {}, 100, 'g');
    this.initialFormData = new FoodDescriptionFormValue(this.food.desc.fg, this.food.desc.manu, this.food.desc.name);
  }

  private setupForm(): void {
    this.formConfigs = [
      {
        appearance: 'outline',
        formControlName: 'name',
        fxFlex: { default: '100%' },
        label: 'Name',
        placeholder: 'Name',
        state: {
          required: true
        },
        validations: [
          {
            message: 'Name is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Input
      },
      <DynamicFormSelectConfig>{
        appearance: 'outline',
        formControlName: 'fg',
        fxFlex: { default: '100%' },
        label: 'Food group',
        placeholder: 'Food group',
        state: {
          required: true
        },
        options: this.foodGroups,
        validations: [
          {
            message: 'Food group is required',
            name: 'required'
          }
        ],
        type: DynamicFormFieldTypes.Select
      },
      {
        appearance: 'outline',
        formControlName: 'manu',
        fxFlex: { default: '100%' },
        label: 'Manufacturer',
        placeholder: 'Manufacturer',
        type: DynamicFormFieldTypes.Input
      }
    ];
  }

  private setupNutrientsForm(): void {
    this.foodNutritionForm = new FormGroup({});
    this.nutrients.forEach((nutrient: USDANutrient) => {
      this.foodNutritionForm.addControl(
        nutrient.name,
        new FormControl(this.food.nutrition && Reflect.has(this.food.nutrition, nutrient.name) ? this.food.nutrition[nutrient.name].value
          : 0)
      );
    });
    this.foodNutritionForm.valueChanges.pipe(takeUntil(this.isDestroyed$)).subscribe(formValues => {
      Object.keys(formValues).forEach((key: string) => {
        this.assignNutrient(key, parseInt(formValues[key], 10));
      });
    });
  }
}
