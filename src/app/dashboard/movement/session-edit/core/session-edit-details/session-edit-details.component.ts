import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Session } from 'app/dashboard/movement/model';
import {
  SessionEditDetailsDialogComponent,
  SessionEditDetailsDialogData
} from 'app/dashboard/movement/session-edit/core/session-edit-details-dialog/session-edit-details-dialog.component';
import { take } from 'app/shared/utils/rxjs-exports';

@Component({
  selector: 'app-session-edit-details',
  templateUrl: './session-edit-details.component.html',
  styleUrls: ['./session-edit-details.component.scss']
})
export class SessionEditDetailsComponent {
  public isOverflown = false;
  @Input() public session: Session;
  @Output() private readonly cancel: EventEmitter<void> = new EventEmitter();
  @Output() private readonly delete: EventEmitter<void> = new EventEmitter();
  @Output() private readonly favoriteChange: EventEmitter<void> = new EventEmitter();
  @Output() private readonly save: EventEmitter<void> = new EventEmitter();
  @Output() private readonly update: EventEmitter<Session> = new EventEmitter();

  constructor(private dialog: MatDialog) {
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  public onDelete(): void {
    this.delete.emit();
  }

  public onFavoritesChange(): void {
    this.favoriteChange.emit();
  }

  public onMouseEnter(event: Event): void {
    const nodeEl: HTMLElement = <HTMLElement>event.target;
    this.isOverflown = nodeEl.scrollWidth > nodeEl.offsetWidth || nodeEl.scrollHeight > nodeEl.offsetHeight;
  }

  public onSave(): void {
    this.save.emit();
  }

  public onSessionDetailsUpdate(): void {
    this.dialog.open(SessionEditDetailsDialogComponent, {
      closeOnNavigation: true, data: this.session, disableClose: true, maxWidth: '600px'
    }).afterClosed().pipe(take(1)).toPromise().then((data: SessionEditDetailsDialogData) => {
      if (data && data.isDirty) {
        const newSession = new Session(
          data.timestamp,
          data.name,
          this.session.activities,
          this.session.duration,
          this.session.energyExpenditure
        );
        newSession.notes = data.notes;
        this.update.emit(newSession);
      }
    });
  }

}
