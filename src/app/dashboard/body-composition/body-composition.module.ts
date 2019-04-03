import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BodyCompositionRoutingModule } from './body-composition-routing.module';
import { BodyCompositionComponent } from './body-composition.component';
import { BodyCompositionCalculationsComponent, BodyCompositionMeasurementsComponent, BodyMeasurementsEditDialogComponent } from './core';

@NgModule({
  imports: [
    BodyCompositionRoutingModule,
    SharedModule
  ],
  declarations: [
    BodyCompositionComponent,
    BodyMeasurementsEditDialogComponent,
    BodyCompositionCalculationsComponent,
    BodyCompositionMeasurementsComponent
  ],
  entryComponents: [BodyMeasurementsEditDialogComponent]
})
export class BodyCompositionModule {
}
