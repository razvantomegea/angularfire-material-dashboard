import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatSelectionListChange } from '@angular/material';

import { Activity, Session } from 'app/dashboard/movement/model';
import { ActivityService } from 'app/dashboard/movement/services/activity.service';
import { PromptDialogComponent, PromptDialogData } from 'app/shared/components';
import { ComponentDestroyed } from 'app/shared/mixins';
import { uniqBy } from 'app/shared/utils/lodash-exports';
import { take } from 'app/shared/utils/rxjs-exports';

@Component({
  selector: 'app-activity-select',
  templateUrl: './activity-select.component.html',
  styleUrls: ['./activity-select.component.scss']
})
export class ActivitySelectComponent extends ComponentDestroyed implements OnChanges, OnInit {
  @Input() private initialActivities: Activity[] = [];
  @Input() private initialSessions: Session[] = [];
  @Input() public activities: Activity[] = [];
  @Input() public isPending = true;
  @Input() public sessions: Session[] = [];

  @Output() private readonly activitiesChange: EventEmitter<Activity[]> = new EventEmitter();
  @Output() private readonly loadMore: EventEmitter<number> = new EventEmitter();
  @Output() private readonly search: EventEmitter<string> = new EventEmitter();
  @Output() private readonly sessionsChange: EventEmitter<Session[]> = new EventEmitter();

  public activitySelectionList: Activity[] = [];
  public noActivities = false;
  public noSessions = false;
  public searchQuery = '';
  public sessionSelectionList: Session[] = [];

  private selectedActivities: Activity[] = [];
  private selectedSessions: Session[] = [];

  constructor(
    private activityService: ActivityService,
    private dialog: MatDialog
  ) {
    super();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.activities && changes.activities.currentValue) {
      this.noActivities = !this.activities.length;
    }

    if (changes.sessions && changes.sessions.currentValue) {
      this.noSessions = !this.sessions.length;
    }

    if (changes.initialActivities && changes.initialActivities.currentValue) {
      if (this.initialActivities.length !== this.selectedActivities.length) {
        this.activitySelectionList = [...this.initialActivities];
        this.selectedActivities = [...this.initialActivities];
      }
    }

    if (changes.initialSessions && changes.initialSessions.currentValue) {
      if (this.initialSessions.length !== this.selectedSessions.length) {
        this.sessionSelectionList = [...this.initialSessions];
        this.selectedSessions = [...this.initialSessions];
      }
    }
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.onSearch('');
    }, 5);
  }

  public compareActivities(selected: Activity | Session, current: Activity | Session): boolean {
    return selected.id && current.id ? selected.id === current.id : selected.name === current.name;
  }

  public async onActivitiesChange(event: MatSelectionListChange): Promise<void> {
    const activity: Activity = event.option.value;
    let activityIndex: number;

    if (event.option['_selected']) {
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
        activityIndex = this.selectedActivities.findIndex((d: Activity) => d.name === activity.name);

        if (activityIndex === -1) {
          this.selectedActivities.push(activity);
        }
      } else {
        event.option._setSelected(false);
        this.activitySelectionList.splice(this.activitySelectionList.findIndex((a: Activity) => a.name === activity.name), 1);
        this.selectedActivities.splice(this.selectedActivities.findIndex((a: Activity) => a.name === activity.name), 1);
      }
    } else {
      activityIndex = this.activitySelectionList.findIndex((d: Activity) => d.name === activity.name);

      if (activityIndex !== -1) {
        this.activitySelectionList.splice(activityIndex, 1);
      }

      activityIndex = this.selectedActivities.findIndex((d: Activity) => d.name === activity.name);

      if (activityIndex !== -1) {
        this.selectedActivities.splice(activityIndex, 1);
      }
    }

    this.activitiesChange.emit(this.selectedActivities);
  }

  public onLoadMore(): void {
    this.loadMore.emit(this.activities.length);
  }

  public onSearch(query: string): void {
    this.searchQuery = (query || '').trim().toLowerCase();
    this.search.emit(this.searchQuery);
  }

  public onSessionsChange(event: MatSelectionListChange): void {
    if (event.option['_selected']) {
      this.selectedSessions = uniqBy([...this.selectedSessions, ...this.sessionSelectionList], (s: Session) => s.id);
    } else {
      this.selectedSessions = [...this.sessionSelectionList];
    }

    this.sessionsChange.emit(this.selectedSessions);
  }
}
