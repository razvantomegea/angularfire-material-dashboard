import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { BloodGlucoseRoutingModule } from './blood-glucose-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { BloodGlucoseComponent } from './blood-glucose.component';
import { BloodGlucoseDetailsDialogComponent } from './core/blood-glucose-details-dialog/blood-glucose-details-dialog.component';

@NgModule({
  imports: [
    BloodGlucoseRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [BloodGlucoseComponent, BloodGlucoseDetailsDialogComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BloodGlucoseModule { }
