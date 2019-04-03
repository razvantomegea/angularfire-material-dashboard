import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BloodPressureRoutingModule } from './blood-pressure-routing.module';
import { BloodPressureComponent } from './blood-pressure.component';
import { BloodPressureDetailsDialogComponent } from './core';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    BloodPressureRoutingModule,
    StoreModule,
    SharedModule
  ],
  declarations: [BloodPressureComponent, BloodPressureDetailsDialogComponent],
  entryComponents: [BloodPressureDetailsDialogComponent]
})
export class BloodPressureModule {
}
