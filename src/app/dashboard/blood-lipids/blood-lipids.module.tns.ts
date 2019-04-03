import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { BloodLipidsRoutingModule } from './blood-lipids-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { BloodLipidsComponent } from './blood-lipids/blood-lipids.component';
import { BloodLipidsDetailsDialogComponent } from './core/blood-lipids-details-dialog/blood-lipids-details-dialog.component';

@NgModule({
  imports: [
    BloodLipidsRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [BloodLipidsComponent, BloodLipidsDetailsDialogComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BloodLipidsModule { }
