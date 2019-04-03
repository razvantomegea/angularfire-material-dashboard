import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Activity, Session } from 'app/dashboard/movement/model';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent {
  @Input() public activities: (Activity | Session)[];
  @Input() public dense: boolean;

  @Output() private readonly editActivity: EventEmitter<Activity | Session> = new EventEmitter();
  @Output() private readonly removeActivity: EventEmitter<number> = new EventEmitter();

  public onEditActivity(activity: Activity | Session): void {
    this.editActivity.emit(activity);
  }

  public onRemoveActivity(activityIndex: number): void {
    this.removeActivity.emit(activityIndex);
  }
}
