import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { NotificationService, RoutingStateService } from 'app/core/services';
import { Activity, ActivityQuery, Session } from 'app/dashboard/movement/model';
import { ActivityService } from 'app/dashboard/movement/services/activity.service';
import { MovementService } from 'app/dashboard/movement/services/movement.service';
import {
  DeleteFavoriteSession,
  DeleteSession,
  GetActivitiesChanges,
  GetFavoriteSessionsChanges,
  QueryActivities,
  QueryFavoriteSessions,
  SaveFavoriteSession,
  SaveSession,
  SelectSession
} from 'app/dashboard/movement/store/actions/movement.actions';
import * as fromMovement from 'app/dashboard/movement/store/reducers';
import { PromptDialogComponent, PromptDialogData } from 'app/shared/components';
import { ComponentDestroyed } from 'app/shared/mixins';
import { flatten, get, set } from 'app/shared/utils/lodash-exports';
import { Observable, take, takeUntil } from 'app/shared/utils/rxjs-exports';

@Component({
  selector: 'app-session-edit',
  templateUrl: './session-edit.component.html',
  styleUrls: ['./session-edit.component.scss']
})
export class SessionEditComponent extends ComponentDestroyed implements OnInit {
  public readonly activities$: Observable<Activity[]> = this.store.pipe(select(fromMovement.getActivities), takeUntil(this.isDestroyed$));
  public readonly isPending$: Observable<number> = this.store.pipe(select(fromMovement.getIsPending), takeUntil(this.isDestroyed$));
  public readonly session$: Observable<Session> = this.store.pipe(select(fromMovement.getSelectedSession), takeUntil(this.isDestroyed$));
  public readonly sessions$: Observable<Session[]> = this.store.pipe(
    select(fromMovement.getFavoriteSessions),
    takeUntil(this.isDestroyed$)
  );
  public hasActivities = false;
  public isPending = true;
  public noData = false;
  public selectedActivities: Activity[] = [];
  public selectedSessions: Session[] = [];
  public session: Session = new Session();
  public showActivityList = false;
  private readonly sessionId: string;
  private activityQuery: ActivityQuery = new ActivityQuery('name', '', 50, 0);
  private isLoaded = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private activityService: ActivityService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private router: Router,
    private routingStateService: RoutingStateService,
    private store: Store<fromMovement.MovementState>
  ) {
    super();
    this.sessionId = this.activatedRoute.snapshot.params.id;
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetFavoriteSessionsChanges());
    this.store.dispatch(new GetActivitiesChanges(this.activityQuery));
    this.store.dispatch(new SelectSession(this.sessionId));

    this.session$.subscribe((session: Session) => {
      if (session) {
        this.session = new Session(
          session.timestamp,
          session.name,
          session.activities,
          session.duration,
          session.energyExpenditure,
          session.notes,
          session.id
        );
        this.toggleActivityListVisibility();
      }
    });

    this.isPending$.subscribe((isPending: number) => {
      setTimeout(() => {
        this.isPending = isPending > 0;

        if (this.isPending === false) {
          this.checkDataDisplay();

          this.isLoaded = true;
        }

        this.toggleActivityListVisibility();
      });
    });
  }

  public calculateTotalDuration(): number {
    return MovementService.calculateDuration([...this.selectedActivities, ...this.selectedSessions]);
  }

  public calculateTotalEnergyExpenditure(): number {
    return MovementService.calculateEnergyExpenditure([...this.selectedActivities, ...this.selectedSessions]);
  }

  public onActivitiesChange(activities: Activity[]): void {
    this.selectedActivities = [...activities];
    this.checkDataDisplay();
    this.updateMovement();
  }

  public onCancel(): void {
    this.router.navigate(['movement']);
  }

  public onDelete(): void {
    this.store.dispatch(new DeleteSession(this.session));
    this.onCancel();
  }

  public async onEditActivity(activity: Activity | Session): Promise<void> {
    const duration: string = await this.dialog.open(PromptDialogComponent, {
      data: new PromptDialogData(
        'Duration (minutes)',
        'number',
        activity.duration,
        'Please enter the activity duration in minutes',
        '',
        'Activity duration'
      ),
      panelClass: 'prompt-dialog'
    }).afterClosed().pipe(take(1)).toPromise();

    if (duration) {
      activity.duration = parseInt(duration, 10);
      activity.energyExpenditure = await this.activityService.calculateActivityEnergyExpenditure(<Activity>activity);
      this.updateMovement();
    }
  }

  public async onFavoritesChange(forceSave?: boolean): Promise<void> {
    if (this.hasActivities && (forceSave || this.session.id)) {
      if (!this.session.name) {
        const name: string = await this.dialog.open(PromptDialogComponent, {
          data: new PromptDialogData(
            'Session name',
            'text',
            this.session.name,
            'Please enter the name of your favorite session',
            'e.g. Morning workout',
            'Favorite session name'
          ),
          panelClass: 'prompt-dialog'
        }).afterClosed().pipe(take(1)).toPromise();

        if (name) {
          this.session.name = name;
          this.store.dispatch(new SaveFavoriteSession(this.session));
        }
      } else {
        this.session.name = '';
        this.store.dispatch(new DeleteFavoriteSession(this.session));
      }
    }
  }

  public onLoadMore(length: number): void {
    this.activityQuery = new ActivityQuery(
      this.activityQuery.prop,
      this.activityQuery.query,
      this.activityQuery.limit,
      length
    );
    this.store.dispatch(new QueryActivities(this.activityQuery));
  }

  public onRemoveActivity(activityIndex: number, activityPath: string): void {
    const activities: Activity[] = get(this, activityPath);
    set(this, activityPath, [...activities.slice(0, activityIndex), ...activities.slice(activityIndex + 1)]);
    this.updateMovement();
    this.checkDataDisplay();
  }

  public onRemoveAll(): void {
    this.selectedSessions = [];
    this.selectedActivities = [];
    this.session.activities = [];
    this.checkDataDisplay();
  }

  public async onSave(): Promise<void> {
    this.session.activities = [
      ...this.selectedActivities,
      ...flatten(this.selectedSessions.map((m: Session) => m.activities)),
      ...this.session.activities
    ];

    if (!!this.session.activities.length) {
      this.updateMovement();

      if (!this.session.name) {
        const hasConfirmed: boolean = await this.notificationService.showNotificationDialog(
          'Do you want to add this session to favorites?',
          'Add to favorites',
          true,
          'YES'
        ).afterClosed().pipe((take(1))).toPromise();

        if (hasConfirmed) {
          await this.onFavoritesChange(true);
        }
      }

      this.store.dispatch(new SaveSession(this.session));
      this.onCancel();
    } else {
      this.notificationService.showInfo('You need at least 1 activity to save the session');
    }
  }

  public onSearch(query: string): void {
    this.activityQuery = new ActivityQuery(this.activityQuery.prop, query, 50, 0);
    this.store.dispatch(new QueryActivities(this.activityQuery));
    this.store.dispatch(new QueryFavoriteSessions(query));
  }

  public async onSessionDetailsUpdate(session: Session): Promise<void> {
    this.session.timestamp = session.timestamp;
    this.session.notes = session.notes;
    await this.onFavoritesChange();
  }

  public onSessionsChange(sessions: Session[]): void {
    this.selectedSessions = sessions;
    this.checkDataDisplay();
    this.updateMovement();
  }

  private checkDataDisplay(): void {
    this.noData = !this.session.activities.length && !this.selectedActivities.length &&
      !this.selectedSessions.length;
  }

  private toggleActivityListVisibility(): void {
    setTimeout(() => {
      this.showActivityList = !this.isPending && !!this.isLoaded &&
        !!(this.session && this.session.activities && this.session.activities.length);
    });
  }

  private updateMovement(): void {
    const selectedActivities: Activity[] = [
      ...this.selectedActivities,
      ...flatten(this.selectedSessions.map((m: Session) => m.activities)),
      ...this.session.activities
    ];

    this.hasActivities = !!selectedActivities.length;
    this.session.energyExpenditure = MovementService.calculateEnergyExpenditure(selectedActivities);
    this.session.duration = MovementService.calculateDuration(selectedActivities);
  }

}
