import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { RoutingStateService } from 'app/core/services';
import { BloodPressure } from 'app/dashboard/blood-pressure/model';
import {
  GetBloodPressureChanges,
  GetBloodPressureTrends,
  QueryTrends,
  SaveBloodPressure
} from 'app/dashboard/blood-pressure/store/actions/blood-pressure.actions';
import * as fromBloodPressure from 'app/dashboard/blood-pressure/store/reducers';
import { TrendsFilterDialogData } from 'app/dashboard/shared';
import { Trends } from 'app/dashboard/shared/mixins';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { CURRENT } from 'app/shared/mixins';
import { Observable, take, takeUntil } from 'app/shared/utils/rxjs-exports';
import {
  BloodPressureDetailsDialogComponent,
  BloodPressureDetailsDialogData
} from './core/blood-pressure-details-dialog/blood-pressure-details-dialog.component';
import { BloodPressureService } from './services/blood-pressure.service';

enum TrendsSeriesNames {
  Diastolic = 'diastolic',
  Systolic = 'systolic'
}

@Component({
  selector: 'app-blood-pressure',
  templateUrl: './blood-pressure.component.html',
  styleUrls: ['./blood-pressure.component.scss']
})
export class BloodPressureComponent extends Trends implements OnInit {
  public readonly bloodPressure$: Observable<BloodPressure> = this.store.pipe(
    select(fromBloodPressure.getBloodPressure),
    takeUntil(this.isDestroyed$)
  );
  public readonly bloodPressureTrends$: Observable<BloodPressure[]> = this.store.pipe(
    select(fromBloodPressure.getBloodPressureTrends),
    takeUntil(this.isDestroyed$)
  );
  public readonly isPending$: Observable<number> = this.store.pipe(select(fromBloodPressure.getIsPending), takeUntil(this.isDestroyed$));
  public bloodPressure: BloodPressure = new BloodPressure();
  public isOverflown = false;
  public isPending = true;
  public noData = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private routingStateService: RoutingStateService,
    private bloodPressureService: BloodPressureService,
    private store: Store<fromBloodPressure.BloodPressureState>
  ) {
    super(CURRENT, 7, 'Diastolic', dialog);
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetBloodPressureChanges());
    this.store.dispatch(new GetBloodPressureTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));

    this.bloodPressure$.subscribe((bloodPressure: BloodPressure) => {
      if (bloodPressure) {
        if (bloodPressure.timestamp !== CURRENT) {
          this.store.dispatch(new SaveBloodPressure(this.bloodPressure));
        } else {
          this.bloodPressure = new BloodPressure(
            bloodPressure.diastolic,
            bloodPressure.systolic,
            bloodPressure.notes,
            bloodPressure.id,
            bloodPressure.timestamp
          );
        }
      }
    });

    this.bloodPressureTrends$.subscribe((trends: BloodPressure[]) => {
      this.mapTrendsToChart(trends);
    });

    this.isPending$.subscribe((isPending: number) => {
      this.isPending = isPending > 0;

      if (this.isPending === false && !this.bloodPressure) {
        this.noData = true;
      }
    });
  }

  // TODO: Implement dialog
  public onBloodPressureDetailsUpdate(): void {
    this.dialog.open(BloodPressureDetailsDialogComponent, {
      closeOnNavigation: true, data: this.bloodPressure, disableClose: true,  maxWidth: '600px'
    }).afterClosed().pipe(take(1)).toPromise().then((data: BloodPressureDetailsDialogData) => {
      if (data && data.isDirty) {
        const newBloodPressure: BloodPressure = new BloodPressure(
          parseInt(data.diastolic, 10),
          parseInt(data.systolic, 10),
          data.notes,
          this.bloodPressure.id
        );

        // TODO: On save/cancel/delete
        this.store.dispatch(new SaveBloodPressure(newBloodPressure));
      }
    });
  }

  public onMouseEnter(event: Event): void {
    const nodeEl: HTMLElement = <HTMLElement>event.target;
    this.isOverflown = nodeEl.scrollWidth > nodeEl.offsetWidth || nodeEl.scrollHeight > nodeEl.offsetHeight;
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

  private mapTrendsToChart(trends: BloodPressure[]): void {
    this.setupTrendsData(
      trends.map((trend: BloodPressure) => trend[TrendsSeriesNames[this.trendSeries]]),
      trends.map((trend: BloodPressure) => trend.timestamp)
    );
  }
}
