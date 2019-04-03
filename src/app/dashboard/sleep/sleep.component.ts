import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { RoutingStateService } from 'app/core/services';
import { TrendsFilterDialogData } from 'app/dashboard/shared';
import { Trends } from 'app/dashboard/shared/mixins';
import { TrendsQuery } from 'app/dashboard/shared/model';
import {
  SleepDetailsDialogComponent,
  SleepDetailsDialogData
} from 'app/dashboard/sleep/core/sleep-details-dialog/sleep-details-dialog.component';
import { Sleep } from 'app/dashboard/sleep/model';
import { SleepService } from 'app/dashboard/sleep/services/sleep.service';
import { GetSleepChanges, GetSleepTrends, QueryTrends, SaveSleep } from 'app/dashboard/sleep/store/actions/sleep.actions';
import * as fromSleep from 'app/dashboard/sleep/store/reducers';
import { CURRENT } from 'app/shared/mixins';
import { Observable, take, takeUntil } from 'app/shared/utils/rxjs-exports';

@Component({
  selector: 'app-sleep',
  templateUrl: './sleep.component.html',
  styleUrls: ['./sleep.component.scss']
})
export class SleepComponent extends Trends implements OnInit {
  public readonly isPending$: Observable<number> = this.store.pipe(select(fromSleep.getIsPending), takeUntil(this.isDestroyed$));
  public readonly sleep$: Observable<Sleep> = this.store.pipe(select(fromSleep.getSleep), takeUntil(this.isDestroyed$));
  public readonly sleepTrends$: Observable<Sleep[]> = this.store.pipe(
    select(fromSleep.getSleepTrends),
    takeUntil(this.isDestroyed$)
  );
  public isOverflown = false;
  public isPending = true;
  public noData = false;
  public sleep: Sleep = new Sleep();

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private routingStateService: RoutingStateService,
    private sleepService: SleepService,
    private store: Store<fromSleep.SleepState>
  ) {
    super(CURRENT, 7, 'Duration', dialog);
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetSleepChanges());
    this.store.dispatch(new GetSleepTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));

    this.sleep$.subscribe((sleep: Sleep) => {
      if (sleep) {
        if (sleep.timestamp !== CURRENT) {
          this.store.dispatch(new SaveSleep(this.sleep));
        } else {
          this.sleep = new Sleep(
            sleep.bedTime,
            sleep.fallAsleepDuration,
            sleep.wakeupTime,
            sleep.duration,
            sleep.notes,
            sleep.id,
            sleep.timestamp
          );
        }
      }
    });

    this.sleepTrends$.subscribe((trends: Sleep[]) => {
      this.mapSleepTrendsToChart(trends);
    });

    this.isPending$.subscribe((isPending: number) => {
      this.isPending = isPending > 0;

      if (this.isPending === false && !this.sleep) {
        this.noData = true;
      }
    });
  }

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

  public onSleepDetailsUpdate(): void {
    this.dialog.open(SleepDetailsDialogComponent, {
      closeOnNavigation: true, data: this.sleep, disableClose: true, maxWidth: '600px'
    }).afterClosed().pipe(take(1)).toPromise().then((data: SleepDetailsDialogData) => {
      if (data && data.isDirty) {
        const newSleep: Sleep = new Sleep(
          data.bedTime,
          parseInt(data.fallAsleepDuration, 10),
          data.wakeupTime,
          parseInt(data.duration, 10),
          data.notes,
          this.sleep.id
        );

        // TODO: On save/cancel/delete
        this.store.dispatch(new SaveSleep(newSleep));
      }
    });
  }

  public onTrendsChange(): void {
    this.store.dispatch(new QueryTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));
  }

  public async onTrendsFilter(): Promise<void> {
    const trendsFilterData: TrendsFilterDialogData = await super.filterTrends(['Duration', 'Quality']);

    if (trendsFilterData) {
      this.onTrendsChange();
    }
  }

  private mapSleepTrendsToChart(trends: Sleep[]): void {
    this.setupTrendsData(
      trends.map((trend: Sleep) => trend.duration),
      trends.map((trend: Sleep) => trend.timestamp)
    );
  }
}
