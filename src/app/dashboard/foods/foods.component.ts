import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { RoutingStateService } from 'app/core/services';

import { USDAListQueryParams, USDANutrient } from 'app/dashboard/nutrition/model';
import { ComponentDestroyed } from 'app/shared/mixins';
import { values } from 'app/shared/utils/lodash-exports';
import { Observable, takeUntil } from 'app/shared/utils/rxjs-exports';
import {
  Food,
  FoodSearch,
  FoodSort,
  USDAFoodGroupIds,
  USDAFoodGroups,
  USDANutrientReportQueryParams,
  USDASearchQueryParams
} from './model';
import { GetFoodsChanges, GetNutrientReports, GetNutrients, QueryFoods, SearchFoods } from './store/actions/foods.actions';
import * as fromFoods from './store/reducers';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.scss']
})
export class FoodsComponent extends ComponentDestroyed implements OnInit {
  public readonly foodGroups: string[] = values(USDAFoodGroups);
  public readonly foodSearch$: Observable<FoodSearch[]> = this.store.pipe(select(fromFoods.getFoodSearch), takeUntil(this.isDestroyed$));
  public readonly foodSort$: Observable<FoodSort[]> = this.store.pipe(select(fromFoods.getFoodSort), takeUntil(this.isDestroyed$));
  public readonly foods$: Observable<Food[]> = this.store.pipe(select(fromFoods.getFoods), takeUntil(this.isDestroyed$));
  public readonly isPending$: Observable<number> = this.store.pipe(select(fromFoods.getIsPending), takeUntil(this.isDestroyed$));
  public readonly nutrients$: Observable<USDANutrient[]> = this.store.pipe(select(fromFoods.getNutrients), takeUntil(this.isDestroyed$));
  public foodSearch: FoodSearch[] = [];
  public foodSort: FoodSort[] = [];
  public foods: Food[] = [];
  public isPending = true;
  public noFoods = false;
  public noUSDAFoods = false;
  public searchQuery = '';
  public usdaFoods: (FoodSort | FoodSearch)[] = [];
  private foodGroupQuery = '';
  private nutrientQuery = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingBar: LoadingBarService,
    private router: Router,
    private routingStateService: RoutingStateService,
    private store: Store<fromFoods.FoodsState>
  ) {
    super();
  }

  // TODO: Table async pagination
  public ngOnInit(): void {
    if (!this.routingStateService.getPreviousUrl().includes('foods')) {
      this.store.dispatch(new GetFoodsChanges());
      this.store.dispatch(new GetNutrients(new USDAListQueryParams()));
      this.store.dispatch(new SearchFoods(new USDASearchQueryParams()));

      setTimeout(() => {
        // Required in case when getFoodChanges called from NutritionModule
        this.store.dispatch(new QueryFoods(this.searchQuery));
      });
    }

    this.foods$.subscribe((foods: Food[]) => {
      if (foods && foods.length) {
        this.foods = [...foods].map((food: Food) => ({ ...food, name: food.desc.name, group: food.desc.fg, manu: food.desc.manu }));
      }
    });

    this.foodSearch$.subscribe((foods: FoodSearch[]) => {
      if (foods && foods.length) {
        this.foodSearch = [...foods];
        this.usdaFoods = [...this.foodSearch];
      }
    });

    this.foodSort$.subscribe((foods: FoodSort[]) => {
      if (foods && foods.length) {
        this.foodSort = [...foods];
        this.usdaFoods = [...this.foodSort];
      }
    });

    this.isPending$.subscribe((isPending: number) => {
      this.isPending = isPending > 0;

      if (this.isPending === false) {
        if (!this.foodSearch.length) {
          this.noUSDAFoods = true;
        }

        if (!this.foods.length) {
          this.noFoods = true;
        }
      }
    });
  }

  public onAddFood(): void {
    this.router.navigate(['new'], {
      relativeTo: this.activatedRoute
    });
  }

  public onFilterFoodGroup(foodGroup: string): void {
    this.foodGroupQuery = foodGroup;
    this.getNutrientReports();
  }

  public onFilterNutrient(nutrient: string): void {
    this.nutrientQuery = nutrient;
    this.getNutrientReports();
  }

  public onSearch(query: string): void {
    this.searchQuery = (query || '').trim().toLowerCase();
    this.store.dispatch(new QueryFoods(this.searchQuery));
    this.store.dispatch(new SearchFoods(new USDASearchQueryParams(this.searchQuery)));
  }

  public onSelectFood(food: FoodSearch | Food): void {
    if (Reflect.has(food, 'id')) {
      this.router.navigate([(<Food>food).id], {
        relativeTo: this.activatedRoute
      });
    } else {
      this.router.navigate(['usda', (<FoodSearch>food).ndbno], {
        relativeTo: this.activatedRoute
      });
    }
  }

  private getNutrientReports(): void {
    if (this.nutrientQuery) {
      this.usdaFoods = [];
      this.store.dispatch(new GetNutrientReports(new USDANutrientReportQueryParams(
        [this.nutrientQuery],
        [USDAFoodGroupIds[this.foodGroupQuery] || '']
      )));
    } else {
      this.store.dispatch(new SearchFoods(new USDASearchQueryParams(this.searchQuery, this.foodGroupQuery)));
    }
  }

}
