import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { RoutingStateService } from 'app/core/services';
import { Activity, Movement, Session } from 'app/dashboard/movement/model';
import { MovementService } from 'app/dashboard/movement/services/movement.service';
import {
  DeleteSession,
  GetMovementChanges,
  GetMovementTrends,
  QueryTrends,
  SaveMovement
} from 'app/dashboard/movement/store/actions/movement.actions';
import { TrendsFilterDialogData } from 'app/dashboard/shared';
import { Trends } from 'app/dashboard/shared/mixins';
import { TrendsQuery } from 'app/dashboard/shared/model';
import { CURRENT } from 'app/shared/mixins';
import { Observable, takeUntil } from 'app/shared/utils/rxjs-exports';
import * as fromMovement from './store/reducers';

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.scss']
})
export class MovementComponent extends Trends implements OnInit {
  public readonly isDirty$: Observable<boolean> = this.store.pipe(select(fromMovement.getIsDirty), takeUntil(this.isDestroyed$));
  public readonly isPending$: Observable<number> = this.store.pipe(select(fromMovement.getIsPending), takeUntil(this.isDestroyed$));
  public readonly movement$: Observable<Movement> = this.store.pipe(select(fromMovement.getMovement), takeUntil(this.isDestroyed$));
  public readonly movementTrends$: Observable<Movement[]> = this.store.pipe(
    select(fromMovement.getMovementTrends),
    takeUntil(this.isDestroyed$)
  );
  public isDirty = false;
  public isPending = true;
  public movement: Movement = new Movement();
  public noData = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private movementService: MovementService,
    private router: Router,
    private routingStateService: RoutingStateService,
    private store: Store<fromMovement.MovementState>
  ) {
    super(CURRENT, 7, 'Energy expenditure', dialog);
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetMovementChanges());
    this.store.dispatch(new GetMovementTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));

    this.movement$.subscribe((movement: Movement) => {
      if (movement) {
        if (movement.timestamp !== CURRENT) {
          this.store.dispatch(new SaveMovement(this.movement));
        } else {
          this.movement = new Movement(
            movement.sessions,
            movement.duration,
            movement.energyExpenditure
          );
          this.updateMovement();
        }
      }
    });

    this.movementTrends$.subscribe((trends: Movement[]) => {
      this.mapMovementTrendsToChart(trends);
    });

    this.isDirty$.subscribe((isDirty: boolean) => {
      this.isDirty = isDirty;
      this.updateMovement();
    });

    this.isPending$.subscribe((isPending: number) => {
      this.isPending = isPending > 0;

      if (this.isPending === false && ((this.movement && !this.movement.sessions.length) || !this.movement)) {
        this.noData = true;
      }
    });
  }

  public onAddSession(): void {
    this.router.navigate(['sessions', 'new'], {
      relativeTo: this.activatedRoute
    });
  }

  public onDeleteSession(sessionIndex: number): void {
    this.store.dispatch(new DeleteSession(this.movement.sessions[sessionIndex]));
  }

  public onEditSession(session: Activity | Session): void {
    this.router.navigate(['sessions', (<Session>session).timestamp], {
      relativeTo: this.activatedRoute
    });
  }

  public onTrendsChange(): void {
    this.store.dispatch(new QueryTrends(new TrendsQuery(this.trendsDate, this.trendsInterval)));
  }

  public async onTrendsFilter(): Promise<void> {
    const trendsFilterData: TrendsFilterDialogData = await super.filterTrends(['Energy expenditure', 'Duration']);

    if (trendsFilterData) {
      this.onTrendsChange();
    }
  }

  private mapMovementTrendsToChart(trends: Movement[]): void {
    this.setupTrendsData(
      trends.map((trend: Movement) => trend.energyExpenditure),
      trends.map((trend: Movement) => trend.timestamp)
    );
  }


  private updateMovement(): void {
    if (this.isDirty) {
      this.updateMovementData();
      this.store.dispatch(new SaveMovement(this.movement));
      this.isDirty = false;
    }
  }

  private updateMovementData(): void {
    this.movement.duration = MovementService.calculateDuration(this.movement.sessions);
    this.movement.energyExpenditure = MovementService.calculateEnergyExpenditure(this.movement.sessions);
  }
}
