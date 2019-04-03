import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatSelectionListChange } from '@angular/material';

import { Food, FoodReport, FoodSearch, USDAFoodReportQueryParams, USDASearchQueryParams } from 'app/dashboard/foods/model';
import { FoodsService } from 'app/dashboard/foods/services/foods.service';
import { Meal } from 'app/dashboard/nutrition/model';
import { PromptDialogComponent, PromptDialogData } from 'app/shared/components';
import { ComponentDestroyed } from 'app/shared/mixins';
import { uniqBy } from 'app/shared/utils/lodash-exports';
import { take } from 'app/shared/utils/rxjs-exports';

@Component({
  selector: 'app-food-select',
  templateUrl: './food-select.component.html',
  styleUrls: ['./food-select.component.scss']
})
export class FoodSelectComponent extends ComponentDestroyed implements OnChanges, OnInit {
  @Input() private initialFoods: Food[] = [];
  @Input() private initialMeals: Meal[] = [];
  @Input() private initialUSDAFoods: FoodReport[] = [];
  @Input() public foods: Food[] = [];
  @Input() public foodSearch: FoodSearch[] = [];
  @Input() public isPending = true;
  @Input() public meals: Meal[] = [];

  @Output() private readonly foodsChange: EventEmitter<Food[]> = new EventEmitter();
  @Output() private readonly loadMore: EventEmitter<USDASearchQueryParams> = new EventEmitter();
  @Output() private readonly mealsChange: EventEmitter<Meal[]> = new EventEmitter();
  @Output() private readonly search: EventEmitter<string> = new EventEmitter();
  @Output() private readonly usdaFoodsChange: EventEmitter<FoodReport[]> = new EventEmitter();

  public foodSelectionList: Food[] = [];
  public mealSelectionList: Meal[] = [];
  public noFoods = false;
  public noMeals = false;
  public noUSDAFoods = false;
  public searchQuery = '';
  public usdaSelectionList: FoodSearch[] = [];

  private selectedFoods: Food[] = [];
  private selectedMeals: Meal[] = [];
  private selectedUSDAFoodReports: FoodReport[] = [];

  constructor(
    private dialog: MatDialog,
    private foodService: FoodsService
  ) {
    super();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.foodSearch && changes.foodSearch.currentValue) {
      this.noUSDAFoods = !this.foodSearch.length;
    }

    if (changes.foods && changes.foods.currentValue) {
      this.noFoods = !this.foods.length;
    }

    if (changes.meals && changes.meals.currentValue) {
      this.noMeals = !this.meals.length;
    }

    if (changes.initialFoods && changes.initialFoods.currentValue) {
      if (this.initialFoods.length !== this.selectedFoods.length) {
        this.foodSelectionList = [...this.initialFoods];
        this.selectedFoods = [...this.initialFoods];
      }
    }

    if (changes.initialMeals && changes.initialMeals.currentValue) {
      if (this.initialMeals.length !== this.selectedMeals.length) {
        this.mealSelectionList = [...this.initialMeals];
        this.selectedMeals = [...this.initialMeals];
      }
    }

    if (changes.initialUSDAFoods && changes.initialUSDAFoods.currentValue) {
      if (this.initialUSDAFoods.length !== this.usdaSelectionList.length) {
        this.selectedUSDAFoodReports = [...this.initialUSDAFoods];
        this.usdaSelectionList = this.selectedUSDAFoodReports.map((report: FoodReport, idx: number) => ({
          ds: report.desc.ds,
          group: report.desc.fg,
          manu: report.desc.manu,
          name: report.desc.name,
          ndbno: report.desc.ndbno,
          offset: idx
        }));
      }
    }
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.onSearch('');
    }, 5);
  }

  public compareFoods(selected: FoodSearch | Food | Meal, current: FoodSearch | Food | Meal): boolean {
    return Reflect.has(selected, 'ndbno') && Reflect.has(current, 'ndbno') ? (<FoodSearch>selected).ndbno === (<FoodSearch>current).ndbno
      : (<Food | Meal>selected).id ===
      (<Food | Meal>current).id;
  }

  public async onFoodsChange(event: MatSelectionListChange): Promise<void> {
    const food: Food = event.option.value;
    let foodIndex: number;

    if (event.option['_selected']) {
      const quantity: string = await this.dialog.open(PromptDialogComponent, {
        data: new PromptDialogData('Quantity (g)', 'number', 100, 'Please enter the food quantity in grams', '', 'Food quantity'),
        panelClass: 'prompt-dialog'
      }).afterClosed().pipe(take(1)).toPromise();

      if (quantity) {
        food.quantity = parseInt(quantity, 10);
        foodIndex = this.selectedFoods.findIndex((f: Food) => f.id === food.id);

        if (foodIndex === -1) {
          this.selectedFoods.push(food);
        }
      } else {
        event.option._setSelected(false);
        this.foodSelectionList.splice(this.foodSelectionList.findIndex((f: Food) => f.id === food.id), 1);
        this.selectedFoods.splice(this.selectedFoods.findIndex((f: Food) => f.id === food.id), 1);
      }
    } else {
      foodIndex = this.foodSelectionList.findIndex((f: Food) => f.id === food.id);

      if (foodIndex !== -1) {
        this.foodSelectionList.splice(foodIndex, 1);
      }

      foodIndex = this.selectedFoods.findIndex((f: Food) => f.id === food.id);

      if (foodIndex !== -1) {
        this.selectedFoods.splice(foodIndex, 1);
      }
    }

    this.selectedFoods = uniqBy([...this.selectedFoods, ...this.foodSelectionList], (f: Food) => f.id);
    this.foodsChange.emit(this.selectedFoods);
  }

  public onLoadMore(): void {
    this.loadMore.emit(new USDASearchQueryParams(this.searchQuery, '', '', 'n', this.foodSearch.length, this.foodSearch.length));
  }

  public onMealsChange(event: MatSelectionListChange): void {
    if (event.option['_selected']) {
      this.selectedMeals = uniqBy([...this.selectedMeals, ...this.mealSelectionList], (m: Meal) => m.id);
    } else {
      this.selectedMeals = [...this.mealSelectionList];
    }

    this.mealsChange.emit(this.selectedMeals);
  }

  public onSearch(query: string): void {
    this.searchQuery = (query || '').trim().toLowerCase();
    this.search.emit(this.searchQuery);
  }

  public async onUSDAFoodsChange(event: MatSelectionListChange): Promise<void> {
    const food: FoodSearch = event.option.value;

    if (event.option['_selected']) {
      const quantity: string = await this.dialog.open(PromptDialogComponent, {
        data: new PromptDialogData('Quantity (g)', 'number', 100, 'Please enter the food quantity in grams', '', 'Food quantity'),
        panelClass: 'prompt-dialog'
      }).afterClosed().pipe(take(1)).toPromise();

      if (quantity) {
        const foodReport: FoodReport = await this.foodService.getUSDAFoodReport(new USDAFoodReportQueryParams(food.ndbno)).pipe(
          take(1)).toPromise();

        if (foodReport) {
          foodReport.quantity = parseInt(quantity, 10);
          this.selectedUSDAFoodReports.push(foodReport);
        } else {
          event.option._setSelected(false);
        }
      } else {
        event.option._setSelected(false);
      }
    } else {
      const foodReportIndex: number = this.selectedUSDAFoodReports.findIndex((fr: FoodReport) => fr.desc.ndbno === food.ndbno);

      if (foodReportIndex !== -1) {
        this.selectedUSDAFoodReports.splice(foodReportIndex, 1);
      }
    }

    this.usdaFoodsChange.emit(this.selectedUSDAFoodReports);
  }

}
