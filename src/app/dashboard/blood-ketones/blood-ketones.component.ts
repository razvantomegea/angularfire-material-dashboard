import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { RoutingStateService } from 'app/core/services';
import { BloodKetones } from 'app/dashboard/blood-ketones/model';
import {
  GetBloodKetonesChanges,
  GetBloodKetonesTrends,
  QueryTrends,
  SaveBloodKetones
} from 'app/dashboard/blood-ketones/store/actions/blood-ketones.actions';
import * as fromBloodKetones from 'app/dashboard/blood-ketones/store/reducers';
import { TrendsFilterDialogData } from 'app/dashboard/shared';
import { Trends } from 'app/dashboard/shared/mixins';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { CURRENT } from 'app/shared/mixins';
import { Observable, take, takeUntil } from 'app/shared/utils/rxjs-exports';
import {
  BloodKetonesDetailsDialogComponent,
  BloodKetonesDetailsDialogData
} from './core/blood-ketones-details-dialog/blood-ketones-details-dialog.component';
import { BloodKetonesService } from './services/blood-ketones.service';

enum TrendsSeriesNames {
  'Units' = 'units'
}

@Component({
  selector: 'app-blood-ketones',
  templateUrl: './blood-ketones.component.html',
  styleUrls: ['./blood-ketones.component.scss']
})
export class BloodKetonesComponent extends Trends implements OnInit {
  public readonly bloodKetones$: Observable<BloodKetones> = this.store.pipe(
    select(fromBloodKetones.getBloodKetones),
    takeUntil(this.isDestroyed$)
  );
  public readonly bloodKetonesTrends$: Observable<BloodKetones[]> = this.store.pipe(
    select(fromBloodKetones.getBloodKetonesTrends),
    takeUntil(this.isDestroyed$)
  );
  public readonly isPending$: Observable<number> = this.store.pipe(
    select(fromBloodKetones.getIsPending),
    takeUntil(this.isDestroyed$)
  );
  public bloodKetones: BloodKetones = new BloodKetones();
  public isOverflown = false;
  public isPending = true;
  public noData = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private routingStateService: RoutingStateService,
    private bloodKetonesService: BloodKetonesService,
    private store: Store<fromBloodKetones.BloodKetonesState>
  ) {
    super(CURRENT, 7, 'Units', dialog);
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetBloodKetonesChanges());
    this.store.dispatch(new GetBloodKetonesTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));

    this.bloodKetones$.subscribe((bloodKetones: BloodKetones) => {
      if (bloodKetones) {
        if (bloodKetones.timestamp !== CURRENT) {
          this.store.dispatch(new SaveBloodKetones(this.bloodKetones));
        } else {
          this.bloodKetones = new BloodKetones(
            bloodKetones.units,
            bloodKetones.notes,
            bloodKetones.id,
            bloodKetones.timestamp
          );
        }
      }
    });

    this.bloodKetonesTrends$.subscribe((trends: BloodKetones[]) => {
      this.mapTrendsToChart(trends);
    });

    this.isPending$.subscribe((isPending: number) => {
      this.isPending = isPending > 0;

      if (this.isPending === false && !this.bloodKetones) {
        this.noData = true;
      }
    });
  }

  // TODO: Implement dialog
  public onBloodKetonesDetailsUpdate(): void {
    this.dialog.open(BloodKetonesDetailsDialogComponent, {
      closeOnNavigation: true, data: this.bloodKetones, disableClose: true, maxWidth: '600px'
    }).afterClosed().pipe(take(1)).toPromise().then((data: BloodKetonesDetailsDialogData) => {
      if (data && data.isDirty) {
        const newBloodKetones: BloodKetones = new BloodKetones(
          parseInt(data.units, 10),
          data.notes,
          this.bloodKetones.id
        );

        // TODO: On save/cancel/delete
        this.store.dispatch(new SaveBloodKetones(newBloodKetones));
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

  private mapTrendsToChart(trends: BloodKetones[]): void {
    this.setupTrendsData(
      trends.map((trend: BloodKetones) => trend[TrendsSeriesNames[this.trendSeries]]),
      trends.map((trend: BloodKetones) => trend.timestamp)
    );
  }
}
