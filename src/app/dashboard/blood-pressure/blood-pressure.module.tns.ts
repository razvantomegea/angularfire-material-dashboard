import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { BloodPressureRoutingModule } from './blood-pressure-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { BloodPressureComponent } from './blood-pressure.component';
import { BloodLipidsDetailsDialogComponent } from './core/blood-lipids-details-dialog/blood-lipids-details-dialog.component';
import { BloodPressureDetailsDialogComponent } from './core/blood-pressure-details-dialog/blood-pressure-details-dialog.component';

@NgModule({
  imports: [
    BloodPressureRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [BloodPressureComponent, BloodLipidsDetailsDialogComponent, BloodPressureDetailsDialogComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BloodPressureModule { }
