import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BloodHomocysteineRoutingModule } from './blood-homocysteine-routing.module';
import { BloodHomocysteineComponent } from './blood-homocysteine.component';
import { BloodHomocysteineDetailsDialogComponent } from './core';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    BloodHomocysteineRoutingModule,
    StoreModule,
    SharedModule
  ],
  declarations: [BloodHomocysteineComponent, BloodHomocysteineDetailsDialogComponent],
  entryComponents: [BloodHomocysteineDetailsDialogComponent]
})
export class BloodHomocysteineModule {
}
