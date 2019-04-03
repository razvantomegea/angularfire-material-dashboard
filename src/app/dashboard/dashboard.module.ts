import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SidenavComponent, ToolbarComponent } from './core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TrendsFilterDialogComponent } from './shared';

@NgModule({
  imports: [
    DashboardRoutingModule, SharedModule
  ], declarations: [DashboardComponent, SidenavComponent, ToolbarComponent, TrendsFilterDialogComponent],
  entryComponents: [TrendsFilterDialogComponent]
})
export class DashboardModule {
}
