import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BloodGlucoseRoutingModule } from './blood-glucose-routing.module';
import { BloodGlucoseComponent } from './blood-glucose.component';
import { BloodGlucoseDetailsDialogComponent } from './core';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    BloodGlucoseRoutingModule,
    StoreModule,
    SharedModule
  ],
  declarations: [BloodGlucoseComponent, BloodGlucoseDetailsDialogComponent],
  entryComponents: [BloodGlucoseDetailsDialogComponent]
})
export class BloodGlucoseModule {
}
