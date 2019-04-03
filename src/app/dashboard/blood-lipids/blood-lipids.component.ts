import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { RoutingStateService } from 'app/core/services';
import { BloodLipids } from 'app/dashboard/blood-lipids/model';
import {
  GetBloodLipidsChanges,
  GetBloodLipidsTrends,
  QueryTrends,
  SaveBloodLipids
} from 'app/dashboard/blood-lipids/store/actions/blood-lipids.actions';
import * as fromBloodLipids from 'app/dashboard/blood-lipids/store/reducers';
import { TrendsFilterDialogData } from 'app/dashboard/shared';
import { Trends } from 'app/dashboard/shared/mixins';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { CURRENT } from 'app/shared/mixins';
import { Observable, take, takeUntil } from 'app/shared/utils/rxjs-exports';
import {
  BloodLipidsDetailsDialogComponent,
  BloodLipidsDetailsDialogData
} from './core/blood-lipids-details-dialog/blood-lipids-details-dialog.component';
import { BloodLipidsService } from './services/blood-lipids.service';

enum TrendsSeriesNames {
  'HDL' = 'hdl',
  'LDL' = 'ldl',
  'Triglycerides' = 'triglycerides',
  'Total lipids' = 'total'
}

@Component({
  selector: 'app-blood-lipids',
  templateUrl: './blood-lipids.component.html',
  styleUrls: ['./blood-lipids.component.scss']
})
export class BloodLipidsComponent extends Trends implements OnInit {
  public readonly bloodLipids$: Observable<BloodLipids> = this.store.pipe(
    select(fromBloodLipids.getBloodLipids),
    takeUntil(this.isDestroyed$)
  );
  public readonly bloodLipidsTrends$: Observable<BloodLipids[]> = this.store.pipe(
    select(fromBloodLipids.getBloodLipidsTrends),
    takeUntil(this.isDestroyed$)
  );
  public readonly isPending$: Observable<number> = this.store.pipe(select(fromBloodLipids.getIsPending), takeUntil(this.isDestroyed$));
  public bloodLipids: BloodLipids = new BloodLipids();
  public isOverflown = false;
  public isPending = true;
  public noData = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private routingStateService: RoutingStateService,
    private bloodLipidsService: BloodLipidsService,
    private store: Store<fromBloodLipids.BloodLipidsState>
  ) {
    super(CURRENT, 7, 'HDL', dialog);
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetBloodLipidsChanges());
    this.store.dispatch(new GetBloodLipidsTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));

    this.bloodLipids$.subscribe((bloodLipids: BloodLipids) => {
      if (bloodLipids) {
        if (bloodLipids.timestamp !== CURRENT) {
          this.store.dispatch(new SaveBloodLipids(this.bloodLipids));
        } else {
          this.bloodLipids = new BloodLipids(
            bloodLipids.hdl,
            bloodLipids.ldl,
            bloodLipids.total,
            bloodLipids.triglycerides,
            bloodLipids.notes,
            bloodLipids.id,
            bloodLipids.timestamp
          );
        }
      }
    });

    this.bloodLipidsTrends$.subscribe((trends: BloodLipids[]) => {
      this.mapTrendsToChart(trends);
    });

    this.isPending$.subscribe((isPending: number) => {
      this.isPending = isPending > 0;

      if (this.isPending === false && !this.bloodLipids) {
        this.noData = true;
      }
    });
  }

  // TODO: Implement dialog
  public onBloodLipidsDetailsUpdate(): void {
    this.dialog.open(BloodLipidsDetailsDialogComponent, {
      closeOnNavigation: true, data: this.bloodLipids, disableClose: true, maxWidth: '600px'
    }).afterClosed().pipe(take(1)).toPromise().then((data: BloodLipidsDetailsDialogData) => {
      if (data && data.isDirty) {
        const newBloodLipids: BloodLipids = new BloodLipids(
          parseInt(data.hdl, 10),
          parseInt(data.ldl, 10),
          parseInt(data.total, 10),
          parseInt(data.triglycerides, 10),
          data.notes,
          this.bloodLipids.id
        );

        // TODO: On save/cancel/delete
        this.store.dispatch(new SaveBloodLipids(newBloodLipids));
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

  private mapTrendsToChart(trends: BloodLipids[]): void {
    this.setupTrendsData(
      trends.map((trend: BloodLipids) => trend[TrendsSeriesNames[this.trendSeries]]),
      trends.map((trend: BloodLipids) => trend.timestamp)
    );
  }
}
