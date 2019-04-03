import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { RoutingStateService } from 'app/core/services';
import { BloodGlucose } from 'app/dashboard/blood-glucose/model';
import {
  GetBloodGlucoseChanges,
  GetBloodGlucoseTrends,
  QueryTrends,
  SaveBloodGlucose
} from 'app/dashboard/blood-glucose/store/actions/blood-glucose.actions';
import * as fromBloodGlucose from 'app/dashboard/blood-glucose/store/reducers';
import { TrendsFilterDialogData } from 'app/dashboard/shared';
import { Trends } from 'app/dashboard/shared/mixins';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { CURRENT } from 'app/shared/mixins';
import { Observable, take, takeUntil } from 'app/shared/utils/rxjs-exports';
import {
  BloodGlucoseDetailsDialogComponent,
  BloodGlucoseDetailsDialogData
} from './core/blood-glucose-details-dialog/blood-glucose-details-dialog.component';
import { BloodGlucoseService } from './services/blood-glucose.service';

enum TrendsSeriesNames {
  'Bed time' = 'bedTime',
  'Fasting' = 'fasting',
  'Pre-Meal' = 'preMeal',
  'Post-Meal' = 'postMeal',
  'Glycated hemoglobin' = 'hbA1c'
}

@Component({
  selector: 'app-blood-glucose',
  templateUrl: './blood-glucose.component.html',
  styleUrls: ['./blood-glucose.component.scss']
})
export class BloodGlucoseComponent extends Trends implements OnInit {
  public readonly bloodGlucose$: Observable<BloodGlucose> = this.store.pipe(
    select(fromBloodGlucose.getBloodGlucose),
    takeUntil(this.isDestroyed$)
  );
  public readonly bloodGlucoseTrends$: Observable<BloodGlucose[]> = this.store.pipe(
    select(fromBloodGlucose.getBloodGlucoseTrends),
    takeUntil(this.isDestroyed$)
  );
  public readonly isPending$: Observable<number> = this.store.pipe(select(fromBloodGlucose.getIsPending), takeUntil(this.isDestroyed$));
  public bloodGlucose: BloodGlucose = new BloodGlucose();
  public dbBLoodGlucose: BloodGlucose = new BloodGlucose();
  public isOverflown = false;
  public isPending = true;
  public noData = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private routingStateService: RoutingStateService,
    private bloodGlucoseService: BloodGlucoseService,
    private store: Store<fromBloodGlucose.BloodGlucoseState>
  ) {
    super(CURRENT, 7, 'Fasting', dialog);
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetBloodGlucoseChanges());
    this.store.dispatch(new GetBloodGlucoseTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));

    this.bloodGlucose$.subscribe((bloodGlucose: BloodGlucose) => {
      if (bloodGlucose && bloodGlucose.timestamp === CURRENT) {
        this.bloodGlucose = new BloodGlucose(
          bloodGlucose.bedTime,
          bloodGlucose.fasting,
          bloodGlucose.postMeal,
          bloodGlucose.preMeal,
          bloodGlucose.hbA1c,
          bloodGlucose.notes,
          bloodGlucose.id,
          bloodGlucose.timestamp
        );
        this.dbBLoodGlucose = new BloodGlucose(
          bloodGlucose.bedTime,
          bloodGlucose.fasting,
          bloodGlucose.postMeal,
          bloodGlucose.preMeal,
          bloodGlucose.hbA1c,
          bloodGlucose.notes,
          bloodGlucose.id,
          bloodGlucose.timestamp
        );
      }
    });

    this.bloodGlucoseTrends$.subscribe((trends: BloodGlucose[]) => {
      this.mapTrendsToChart(trends);
    });

    this.isPending$.subscribe((isPending: number) => {
      this.isPending = isPending > 0;

      if (this.isPending === false && !this.bloodGlucose) {
        this.noData = true;
      }
    });
  }

  // TODO: Implement dialog
  public onBloodGlucoseDetailsUpdate(): void {
    this.dialog.open(BloodGlucoseDetailsDialogComponent, {
      closeOnNavigation: true, data: this.bloodGlucose, disableClose: true, maxWidth: '600px'
    }).afterClosed().pipe(take(1)).toPromise().then((data: BloodGlucoseDetailsDialogData) => {
      if (data && data.isDirty) {
        this.bloodGlucose = new BloodGlucose(
          parseInt(data.bedTime, 10),
          parseInt(data.fasting, 10),
          parseInt(data.postMeal, 10),
          parseInt(data.preMeal, 10),
          parseInt(data.hbA1c, 10),
          data.notes,
          this.bloodGlucose.id
        );
      }
    });
  }

  // TODO: Implement methods
  public onCancel(): void {

  }

  public onDelete(): void {

  }

  public onMouseEnter(event: Event): void {
    const nodeEl: HTMLElement = <HTMLElement>event.target;
    this.isOverflown = nodeEl.scrollWidth > nodeEl.offsetWidth || nodeEl.scrollHeight > nodeEl.offsetHeight;
  }

  public onSave(): void {
    this.store.dispatch(new SaveBloodGlucose(this.bloodGlucose));
  }

  public onTrendsChange(): void {
    this.store.dispatch(new QueryTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));
  }

  public async onTrendsFilter(): Promise<void> {
    const trendsFilterData: TrendsFilterDialogData = await super.filterTrends(Object.keys(TrendsSeriesNames));

    if (trendsFilterData) {
      this.onTrendsChange();
    }
  }

  private mapTrendsToChart(trends: BloodGlucose[]): void {
    this.setupTrendsData(
      trends.map((trend: BloodGlucose) => trend[TrendsSeriesNames[this.trendSeries]]),
      trends.map((trend: BloodGlucose) => trend.timestamp)
    );
  }
}
