import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BloodKetonesRoutingModule } from './blood-ketones-routing.module';
import { BloodKetonesComponent } from './blood-ketones.component';
import { BloodKetonesDetailsDialogComponent } from './core';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    BloodKetonesRoutingModule,
    StoreModule,
    SharedModule
  ],
  declarations: [BloodKetonesComponent, BloodKetonesDetailsDialogComponent],
  entryComponents: [BloodKetonesDetailsDialogComponent]
})
export class BloodKetonesModule {
}
