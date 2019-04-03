import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { MovementRoutingModule } from './movement-routing.module';
import { MovementComponent } from './movement.component';
import { SessionEditDetailsDialogComponent } from './session-edit/core/session-edit-details-dialog/session-edit-details-dialog.component';
import { SessionEditDetailsComponent } from './session-edit/core/session-edit-details/session-edit-details.component';
import { SessionEditComponent } from './session-edit/session-edit.component';
import { ActivityListComponent } from './shared/activity-list/activity-list.component';
import { ActivitySelectComponent } from './shared/activity-select/activity-select.component';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    MovementRoutingModule,
    StoreModule,
    SharedModule
  ],
  declarations: [
    MovementComponent,
    SessionEditComponent,
    SessionEditDetailsComponent,
    SessionEditDetailsDialogComponent,
    ActivityListComponent,
    ActivitySelectComponent
  ],
  entryComponents: [SessionEditDetailsDialogComponent]
})
export class MovementModule {
}
