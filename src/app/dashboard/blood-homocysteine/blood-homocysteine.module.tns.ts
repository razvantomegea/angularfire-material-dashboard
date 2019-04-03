import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { BloodHomocysteineRoutingModule } from './blood-homocysteine-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { BloodHomocysteineComponent } from './blood-homocysteine.component';
import { BloodHomocysteineDetailsDialogComponent } from './core/blood-homocysteine-details-dialog/blood-homocysteine-details-dialog.component';

@NgModule({
  imports: [
    BloodHomocysteineRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [BloodHomocysteineComponent, BloodHomocysteineDetailsDialogComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BloodHomocysteineModule { }
