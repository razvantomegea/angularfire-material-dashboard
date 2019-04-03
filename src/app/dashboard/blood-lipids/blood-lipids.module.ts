import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BloodLipidsRoutingModule } from './blood-lipids-routing.module';
import { BloodLipidsComponent } from './blood-lipids.component';
import { BloodLipidsDetailsDialogComponent } from './core';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    BloodLipidsRoutingModule,
    StoreModule,
    SharedModule
  ],
  declarations: [BloodLipidsComponent, BloodLipidsDetailsDialogComponent],
  entryComponents: [BloodLipidsDetailsDialogComponent]
})
export class BloodLipidsModule {
}
