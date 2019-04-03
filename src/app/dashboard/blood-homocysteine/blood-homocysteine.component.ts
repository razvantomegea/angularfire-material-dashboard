import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { RoutingStateService } from 'app/core/services';
import { BloodHomocysteine } from 'app/dashboard/blood-homocysteine/model';
import {
  GetBloodHomocysteineChanges,
  GetBloodHomocysteineTrends,
  QueryTrends,
  SaveBloodHomocysteine
} from 'app/dashboard/blood-homocysteine/store/actions/blood-homocysteine.actions';
import * as fromBloodHomocysteine from 'app/dashboard/blood-homocysteine/store/reducers';
import { TrendsFilterDialogData } from 'app/dashboard/shared';
import { Trends } from 'app/dashboard/shared/mixins';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { CURRENT } from 'app/shared/mixins';
import { Observable, take, takeUntil } from 'app/shared/utils/rxjs-exports';
import {
  BloodHomocysteineDetailsDialogComponent,
  BloodHomocysteineDetailsDialogData
} from './core/blood-homocysteine-details-dialog/blood-homocysteine-details-dialog.component';
import { BloodHomocysteineService } from './services/blood-homocysteine.service';

enum TrendsSeriesNames {
  'Units' = 'units'
}

@Component({
  selector: 'app-blood-homocysteine',
  templateUrl: './blood-homocysteine.component.html',
  styleUrls: ['./blood-homocysteine.component.scss']
})
export class BloodHomocysteineComponent extends Trends implements OnInit {
  public readonly bloodHomocysteine$: Observable<BloodHomocysteine> = this.store.pipe(
    select(fromBloodHomocysteine.getBloodHomocysteine),
    takeUntil(this.isDestroyed$)
  );
  public readonly bloodHomocysteineTrends$: Observable<BloodHomocysteine[]> = this.store.pipe(
    select(fromBloodHomocysteine.getBloodHomocysteineTrends),
    takeUntil(this.isDestroyed$)
  );
  public readonly isPending$: Observable<number> = this.store.pipe(
    select(fromBloodHomocysteine.getIsPending),
    takeUntil(this.isDestroyed$)
  );
  public bloodHomocysteine: BloodHomocysteine = new BloodHomocysteine();
  public isOverflown = false;
  public isPending = true;
  public noData = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private routingStateService: RoutingStateService,
    private bloodHomocysteineService: BloodHomocysteineService,
    private store: Store<fromBloodHomocysteine.BloodHomocysteineState>
  ) {
    super(CURRENT, 7, 'Units', dialog);
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetBloodHomocysteineChanges());
    this.store.dispatch(new GetBloodHomocysteineTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));

    this.bloodHomocysteine$.subscribe((bloodHomocysteine: BloodHomocysteine) => {
      if (bloodHomocysteine) {
        if (bloodHomocysteine.timestamp !== CURRENT) {
          this.store.dispatch(new SaveBloodHomocysteine(this.bloodHomocysteine));
        } else {
          this.bloodHomocysteine = new BloodHomocysteine(
            bloodHomocysteine.units,
            bloodHomocysteine.notes,
            bloodHomocysteine.id,
            bloodHomocysteine.timestamp
          );
        }
      }
    });

    this.bloodHomocysteineTrends$.subscribe((trends: BloodHomocysteine[]) => {
      this.mapTrendsToChart(trends);
    });

    this.isPending$.subscribe((isPending: number) => {
      this.isPending = isPending > 0;

      if (this.isPending === false && !this.bloodHomocysteine) {
        this.noData = true;
      }
    });
  }

  // TODO: Implement dialog
  public onBloodHomocysteineDetailsUpdate(): void {
    this.dialog.open(BloodHomocysteineDetailsDialogComponent, {
      closeOnNavigation: true, data: this.bloodHomocysteine, disableClose: true, maxWidth: '600px'
    }).afterClosed().pipe(take(1)).toPromise().then((data: BloodHomocysteineDetailsDialogData) => {
      if (data && data.isDirty) {
        const newBloodHomocysteine: BloodHomocysteine = new BloodHomocysteine(
          parseInt(data.units, 10),
          data.notes,
          this.bloodHomocysteine.id
        );

        // TODO: On save/cancel/delete
        this.store.dispatch(new SaveBloodHomocysteine(newBloodHomocysteine));
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

  private mapTrendsToChart(trends: BloodHomocysteine[]): void {
    this.setupTrendsData(
      trends.map((trend: BloodHomocysteine) => trend[TrendsSeriesNames[this.trendSeries]]),
      trends.map((trend: BloodHomocysteine) => trend.timestamp)
    );
  }
}
