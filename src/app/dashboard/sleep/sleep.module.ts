import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SleepDetailsDialogComponent } from './core';
import { SleepRoutingModule } from './sleep-routing.module';
import { SleepComponent } from './sleep.component';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    SleepRoutingModule,
    StoreModule,
    SharedModule
  ],
  declarations: [SleepComponent, SleepDetailsDialogComponent],
  entryComponents: [SleepDetailsDialogComponent]
})
export class SleepModule {
}
