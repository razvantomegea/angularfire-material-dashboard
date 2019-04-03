import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { BloodKetonesRoutingModule } from './blood-ketones-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { BloodKetonesDetailsDialogComponent } from './core/blood-ketones-details-dialog/blood-ketones-details-dialog.component';
import { BloodKetonesComponent } from './blood-ketones.component';

@NgModule({
  imports: [
    BloodKetonesRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [BloodKetonesDetailsDialogComponent, BloodKetonesComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BloodKetonesModule { }
