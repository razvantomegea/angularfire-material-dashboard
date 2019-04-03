import { flatten } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { NotificationService, RoutingStateService } from 'app/core/services';
import { Food, FoodReport, FoodSearch, USDASearchQueryParams } from 'app/dashboard/foods/model';
import { GetFoodsChanges, GetNutrients, QueryFoods, SearchFoods } from 'app/dashboard/foods/store/actions/foods.actions';
import { Nutrition, USDAListQueryParams, USDANutrient } from 'app/dashboard/nutrition/model';
import { Meal } from 'app/dashboard/nutrition/model/meal';
import { NutritionService } from 'app/dashboard/nutrition/services/nutrition.service';
import {
  DeleteFavoriteMeal,
  DeleteMeal,
  GetFavoriteMealsChanges,
  GetRequiredNutrition,
  QueryFavoriteMeals,
  SaveFavoriteMeal,
  SaveMeal,
  SelectMeal
} from 'app/dashboard/nutrition/store/actions/nutrition.actions';
import { PromptDialogComponent, PromptDialogData } from 'app/shared/components';
import { ComponentDestroyed } from 'app/shared/mixins';
import { get, set } from 'app/shared/utils/lodash-exports';
import { Observable, take, takeUntil } from 'app/shared/utils/rxjs-exports';
import * as fromNutrition from '../store/reducers';

@Component({
  selector: 'app-meal-edit',
  templateUrl: './meal-edit.component.html',
  styleUrls: ['./meal-edit.component.scss']
})
export class MealEditComponent extends ComponentDestroyed implements OnInit {
  public readonly foodSearch$: Observable<FoodSearch[]> = this.store.pipe(
    select(fromNutrition.getFoodSearch),
    takeUntil(this.isDestroyed$)
  );
  public readonly foods$: Observable<Food[]> = this.store.pipe(select(fromNutrition.getFoods), takeUntil(this.isDestroyed$));
  public readonly isPending$: Observable<number> = this.store.pipe(select(fromNutrition.getIsPending), takeUntil(this.isDestroyed$));
  public readonly meal$: Observable<Meal> = this.store.pipe(select(fromNutrition.getSelectedMeal), takeUntil(this.isDestroyed$));
  public readonly meals$: Observable<Meal[]> = this.store.pipe(select(fromNutrition.getFavoriteMeals), takeUntil(this.isDestroyed$));
  public readonly nutrients$: Observable<USDANutrient[]> = this.store.pipe(
    select(fromNutrition.getNutrients),
    takeUntil(this.isDestroyed$)
  );
  public readonly requiredNutrition$: Observable<Nutrition> = this.store.pipe(
    select(fromNutrition.getRequiredNutrition),
    takeUntil(this.isDestroyed$)
  );
  public hasFoods = false;
  public isLoaded = false;
  public isPending = true;
  public meal: Meal = new Meal();
  public noData = false;
  public requiredNutrition: Nutrition;
  public selectedFoods: Food[] = [];
  public selectedMeals: Meal[] = [];
  public selectedUSDAFoods: FoodReport[] = [];
  public showFoodList = false;
  public showFullNutrition = false;
  private readonly mealId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router,
    private routingStateService: RoutingStateService,
    private store: Store<fromNutrition.NutritionState>
  ) {
    super();
    this.mealId = this.activatedRoute.snapshot.params.id;
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetRequiredNutrition());
    this.store.dispatch(new GetNutrients(new USDAListQueryParams()));
    this.store.dispatch(new SearchFoods(new USDASearchQueryParams('')));
    this.store.dispatch(new GetFavoriteMealsChanges());
    this.store.dispatch(new GetFoodsChanges());
    this.store.dispatch(new SelectMeal(this.mealId));

    setTimeout(() => {
      // Required in case when getFoodChanges called from FoodsModule
      this.store.dispatch(new QueryFoods(''));
    }, 1);

    this.meal$.subscribe((meal: Meal) => {
      if (meal) {
        this.meal = new Meal(
          meal.timestamp,
          meal.name,
          meal.foods,
          meal.remainingNutrition,
          meal.nutrition,
          meal.metrics,
          meal.quantity,
          meal.unit,
          meal.notes,
          meal.id
        );
        this.toggleFoodListVisibility();
        this.setRemainingNutrition();
      }
    });

    this.isPending$.subscribe((isPending: number) => {
      setTimeout(() => {
        this.isPending = isPending > 0;

        if (this.isPending === false) {
          this.checkDataDisplay();

          this.isLoaded = true;
        }

        this.toggleFoodListVisibility();
      }, 1);
    });

    this.requiredNutrition$.subscribe((nutrition: Nutrition) => {
      this.requiredNutrition = nutrition;
      this.setRemainingNutrition();
    });
  }

  public getTotalWeight(): number {
    return this.meal.foods.reduce((acc: number, curr: Food) => acc += curr.quantity, 0) +
      this.selectedUSDAFoods.reduce((acc: number, curr: FoodReport) => acc += curr.quantity, 0) +
      this.selectedFoods.reduce((acc: number, curr: Food) => acc += curr.quantity, 0) +
      this.selectedMeals.reduce((acc: number, curr: Meal) => acc += curr.quantity, 0);
  }

  public onCancel(): void {
    this.router.navigate(['nutrition']);
  }

  public onDelete(): void {
    this.store.dispatch(new DeleteMeal(this.meal));
    this.onCancel();
  }

  public onEditFood(food: Food | FoodReport, foodIndex?: number, foodPath?: string): void {
    this.dialog.open(PromptDialogComponent, {
      data: new PromptDialogData('Quantity (g)', 'number', food.quantity, 'Please enter the food quantity in grams', '', 'Food quantity'),
      panelClass: 'prompt-dialog'
    }).afterClosed().pipe(take(1)).toPromise().then((quantity: string) => {
      if (quantity) {
        food.quantity = parseInt(quantity, 10);
        // set(this, `${foodPath}[${foodIndex}]`, food);
        this.updateNutrition();
      }
    });
  }

  public async onFavoritesChange(forceSave?: boolean): Promise<void> {
    if (this.hasFoods && (forceSave || this.meal.id)) {
      if (!this.meal.name) {
        const name: string = await this.dialog.open(PromptDialogComponent, {
          data: new PromptDialogData(
            'Meal name',
            'text',
            this.meal.name,
            'Please enter the name of your favorite meal',
            'e.g. healthy frittata, sardine salad, beef with veggies, etc.',
            'Favorite meal name'
          ),
          panelClass: 'prompt-dialog'
        }).afterClosed().pipe(take(1)).toPromise();

        if (name) {
          this.meal.name = name;
          this.store.dispatch(new SaveFavoriteMeal(this.meal));
        }
      } else {
        this.meal.name = '';
        this.store.dispatch(new DeleteFavoriteMeal(this.meal));
      }
    }
  }

  // TODO: Vocal search (e.g. 1 cup of broccoli)
  public onFoodsChange(foods: Food[]): void {
    this.selectedFoods = foods;
    this.checkDataDisplay();
    this.updateNutrition();
  }

  public onLoadMore(params: USDASearchQueryParams): void {
    this.store.dispatch(new SearchFoods(params));
  }

  public async onMealDetailsUpdate(meal: Meal): Promise<void> {
    this.meal.timestamp = meal.timestamp;
    this.meal.notes = meal.notes;
    await this.onFavoritesChange();
  }

  public onMealsChange(meals: Meal[]): void {
    this.selectedMeals = meals;
    this.checkDataDisplay();
    this.updateNutrition();
  }

  public onRemoveAll(): void {
    this.selectedMeals = [];
    this.selectedFoods = [];
    this.selectedUSDAFoods = [];
    this.meal.foods = [];
    this.checkDataDisplay();
  }

  public onRemoveFood(foodIndex: number, foodPath: string): void {
    const foods: (FoodReport | Food)[] = get(this, foodPath);
    set(this, foodPath, [...foods.slice(0, foodIndex), ...foods.slice(foodIndex + 1)]);
    this.updateNutrition();
    this.checkDataDisplay();
  }

  public async onSave(): Promise<void> {
    this.meal.foods = [
      ...this.selectedUSDAFoods,
      ...this.selectedFoods,
      ...flatten(this.selectedMeals.map((m: Meal) => m.foods)),
      ...this.meal.foods
    ];

    if (!!this.meal.foods.length) {
      this.updateNutrition();

      if (!this.meal.name) {
        const hasConfirmed: boolean = await this.notificationService.showNotificationDialog(
          'Do you want to add this meal to favorites?',
          'Add to favorites',
          true,
          'YES'
        ).afterClosed().pipe((take(1))).toPromise();

        if (hasConfirmed) {
          await this.onFavoritesChange(true);
        }
      }

      this.store.dispatch(new SaveMeal(this.meal));
      this.onCancel();
    } else {
      this.notificationService.showInfo('You need at least 1 food to save the meal');
    }
  }

  public onSearch(query: string): void {
    this.store.dispatch(new QueryFoods(query));
    this.store.dispatch(new QueryFavoriteMeals(query));
    this.store.dispatch(new SearchFoods(new USDASearchQueryParams(query)));
  }

  public onToggleNutritionInfo(): void {
    this.showFullNutrition = !this.showFullNutrition;
  }

  public onUSDAFoodsChange(foods: FoodReport[]): void {
    this.selectedUSDAFoods = foods;
    this.checkDataDisplay();
    this.updateNutrition();
  }

  private checkDataDisplay(): void {
    this.noData = !this.meal.foods.length && !this.selectedFoods.length && !this.selectedUSDAFoods.length && !this.selectedMeals.length;
  }

  private setRemainingNutrition(): void {
    this.meal.remainingNutrition = NutritionService.getRemainingNutrition(this.meal.nutrition, this.requiredNutrition);
  }

  private toggleFoodListVisibility(): void {
    setTimeout(() => {
      this.showFoodList = !this.isPending && !!this.isLoaded && !!(this.meal && this.meal.foods && this.meal.foods.length);
    }, 1);
  }

  private updateNutrition(): void {
    const selectedFoods: (Food | FoodReport)[] = [
      ...this.selectedUSDAFoods,
      ...this.selectedFoods,
      ...flatten(this.selectedMeals.map((m: Meal) => m.foods)),
      ...this.meal.foods
    ];

    this.hasFoods = !!selectedFoods.length;
    this.meal.nutrition = NutritionService.getCompletedNutrition(selectedFoods);
    this.meal.quantity = NutritionService.getQuantity(selectedFoods);
    this.setRemainingNutrition();
  }
}
