import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { HealthyHabitsRoutingModule } from './healthy-habits-routing.module';
import { HealthyHabitsComponent } from './healthy-habits.component';

@NgModule({
  imports: [
    HealthyHabitsRoutingModule,
    SharedModule
  ],
  declarations: [HealthyHabitsComponent]
})
export class HealthyHabitsModule {
}
