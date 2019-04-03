import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { RoutingStateService, UtilsService } from 'app/core/services';
import { Nutrient, USDAListQueryParams } from 'app/dashboard/nutrition/model';
import { ComponentDestroyed } from 'app/shared/mixins';
import { uniq, values } from 'app/shared/utils/lodash-exports';
import { Observable, takeUntil } from 'app/shared/utils/rxjs-exports';
import { Food, FoodReport, FoodReportNutrient, USDAFoodReportQueryParams, USDASearchQueryParams } from '../model';
import {
  DeleteFood,
  GetFoodReport,
  GetFoodsChanges,
  GetNutrients,
  QueryFoods,
  SearchFoods,
  SelectFood
} from '../store/actions/foods.actions';
import * as fromFoods from '../store/reducers';

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.component.html',
  styleUrls: ['./food-details.component.scss']
})
export class FoodDetailsComponent extends ComponentDestroyed implements OnInit {
  public food: FoodReport | Food;
  public nutrientGroups: string[] = [];
  public nutrients: (Nutrient | FoodReportNutrient)[] = [];
  private readonly food$: Observable<Food> = this.store.pipe(
    select(fromFoods.getSelectedFood),
    takeUntil(this.isDestroyed$)
  );
  private readonly foodReport$: Observable<FoodReport> = this.store.pipe(
    select(fromFoods.getSelectedFoodReport),
    takeUntil(this.isDestroyed$)
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routingStateService: RoutingStateService,
    private store: Store<fromFoods.FoodsState>
  ) {
    super();
  }

  public ngOnInit(): void {
    const { id } = this.activatedRoute.snapshot.params;

    if (!this.routingStateService.getPreviousUrl().includes('foods')) {
      this.store.dispatch(new GetFoodsChanges());
      this.store.dispatch(new GetNutrients(new USDAListQueryParams()));
      this.store.dispatch(new SearchFoods(new USDASearchQueryParams('')));

      setTimeout(() => {
        // Required in case when getFoodChanges called from NutritionModule
        this.store.dispatch(new QueryFoods(''));
      });
    }

    if (this.router.url.includes('usda')) {
      this.store.dispatch(new GetFoodReport(new USDAFoodReportQueryParams(id)));
      this.foodReport$.subscribe((report: FoodReport) => {
        if (report) {
          this.food = report;
          this.setupNutrients();
        }
      });
    } else {
      this.store.dispatch(new SelectFood(id));
      this.food$.subscribe((food: Food) => {
        if (food) {
          this.food = food;
          this.setupNutrients();
        }
      });
    }
  }

  public getNutrientsByGroup(group: string): (Nutrient | FoodReportNutrient)[] {
    return this.nutrients.filter((nutrient: Nutrient | FoodReportNutrient) => nutrient.group === group);
  }

  public isArray(obj: any): boolean {
    return UtilsService.isArray(obj);
  }

  public onDelete(): void {
    this.store.dispatch(new DeleteFood((<Food>this.food).id));
    this.onGoBack();
  }

  public onEdit(): void {
    this.router.navigate(['edit'], {
      relativeTo: this.activatedRoute
    });
  }

  public onGoBack(): void {
    this.router.navigate(['foods']);
  }

  private setupNutrients(): void {
    this.nutrients = values(this.food.nutrition);
    this.nutrientGroups = uniq(this.nutrients.map((nutrient: Nutrient | FoodReportNutrient) => nutrient.group));
  }
}
