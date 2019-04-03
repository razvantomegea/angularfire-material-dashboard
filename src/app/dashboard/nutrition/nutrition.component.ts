import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { RoutingStateService } from 'app/core/services';
import { GetNutrients } from 'app/dashboard/foods/store/actions/foods.actions';
import { Diet, Nutrient, NutrientNames, Nutrition, USDAListQueryParams, USDANutrient } from 'app/dashboard/nutrition/model';
import { Meal } from 'app/dashboard/nutrition/model/meal';
import { NutritionService } from 'app/dashboard/nutrition/services/nutrition.service';
import {
  DeleteMeal,
  GetDietChanges,
  GetDietTrends,
  GetRequiredNutrition,
  QueryTrends,
  SaveDiet
} from 'app/dashboard/nutrition/store/actions/nutrition.actions';
import { TrendsFilterDialogData } from 'app/dashboard/shared';
import { Trends } from 'app/dashboard/shared/mixins';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { CURRENT } from 'app/shared/mixins';
import { values } from 'app/shared/utils/lodash-exports';
import { Observable, takeUntil } from 'app/shared/utils/rxjs-exports';
import * as fromNutrition from './store/reducers';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.scss']
})
export class NutritionComponent extends Trends implements OnInit {
  public readonly diet$: Observable<Diet> = this.store.pipe(select(fromNutrition.getDiet), takeUntil(this.isDestroyed$));
  public readonly dietTrends$: Observable<Diet[]> = this.store.pipe(select(fromNutrition.getDietTrends), takeUntil(this.isDestroyed$));
  public readonly isDirty$: Observable<boolean> = this.store.pipe(select(fromNutrition.getIsDirty), takeUntil(this.isDestroyed$));
  public readonly isPending$: Observable<number> = this.store.pipe(select(fromNutrition.getIsPending), takeUntil(this.isDestroyed$));
  public readonly nutrients$: Observable<USDANutrient[]> = this.store.pipe(
    select(fromNutrition.getNutrients),
    takeUntil(this.isDestroyed$)
  );
  public readonly requiredNutrition$: Observable<Nutrition> = this.store.pipe(
    select(fromNutrition.getRequiredNutrition),
    takeUntil(this.isDestroyed$)
  );
  public diet: Diet = new Diet();
  public isDirty = false;
  public isPending = true;
  public noData = false;
  public showFullNutrition = false;
  private requiredNutrition: Nutrition;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private nutritionService: NutritionService,
    private router: Router,
    private routingStateService: RoutingStateService,
    private store: Store<fromNutrition.NutritionState>
  ) {
    super(CURRENT, 7, NutrientNames.Energy, dialog);
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetRequiredNutrition());
    this.store.dispatch(new GetNutrients(new USDAListQueryParams()));
    this.store.dispatch(new GetDietChanges());
    this.store.dispatch(new GetDietTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));

    this.diet$.subscribe((diet: Diet) => {
      if (diet) {
        if (diet.timestamp !== CURRENT) {
          this.store.dispatch(new SaveDiet(this.diet));
        } else {
          this.diet = new Diet(
            diet.meals,
            diet.requiredNutrition,
            diet.remainingNutrition,
            diet.completedNutrition,
            diet.metrics,
            diet.quantity,
            diet.unit
          );
          this.updateDiet();
        }
      }
    });

    this.dietTrends$.subscribe((trends: Diet[]) => {
      this.mapDietTrendsToChart(trends);
    });

    this.requiredNutrition$.subscribe((nutrition: Nutrition) => {
      this.requiredNutrition = nutrition;
      this.setRemainingNutrition();
    });

    this.isDirty$.subscribe((isDirty: boolean) => {
      this.isDirty = isDirty;
      this.updateDiet();
    });

    this.isPending$.subscribe((isPending: number) => {
      this.isPending = isPending > 0;

      if (this.isPending === false && ((this.diet && !this.diet.meals.length) || !this.diet)) {
        this.noData = true;
      }
    });
  }

  public onAddMeal(): void {
    this.router.navigate(['meals', 'new'], {
      relativeTo: this.activatedRoute
    });
  }

  public onDeleteMeal(mealIndex: number): void {
    this.store.dispatch(new DeleteMeal(this.diet.meals[mealIndex]));
  }

  public onEditMeal(meal: Meal): void {
    this.router.navigate(['meals', meal.timestamp], {
      relativeTo: this.activatedRoute
    });
  }

  public onToggleNutritionInfo(): void {
    this.showFullNutrition = !this.showFullNutrition;
  }

  public onTrendsChange(): void {
    this.store.dispatch(new QueryTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));
  }

  public async onTrendsFilter(): Promise<void> {
    const trendsFilterData: TrendsFilterDialogData = await super.filterTrends(values(NutrientNames));

    if (trendsFilterData) {
      this.onTrendsChange();
    }
  }

  private mapDietTrendsToChart(trends: Diet[]): void {
    this.setupTrendsData(
      trends.map((trend: Diet) => {
        const nutrient: Nutrient = trend.completedNutrition[this.trendSeries];

        return nutrient ? nutrient.value : 0;
      }),
      trends.map((trend: Diet) => trend.timestamp)
    );
  }

  private setRemainingNutrition(): void {
    this.diet.requiredNutrition = this.requiredNutrition || this.diet.requiredNutrition;

    if (this.diet.requiredNutrition) {
      this.diet.remainingNutrition = NutritionService.getRemainingNutrition(this.diet.completedNutrition, this.diet.requiredNutrition);
    }
  }

  private updateDiet(): void {
    if (this.isDirty) {
      this.updateNutrition();
      this.store.dispatch(new SaveDiet(this.diet));
      this.isDirty = false;
    }
  }

  private updateNutrition(): void {
    this.diet.completedNutrition = NutritionService.getCompletedNutrition(this.diet.meals);
    this.diet.quantity = NutritionService.getQuantity(this.diet.meals);
    this.setRemainingNutrition();
  }
}
