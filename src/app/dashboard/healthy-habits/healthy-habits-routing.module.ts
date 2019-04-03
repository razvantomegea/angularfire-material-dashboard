import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthyHabitsComponent } from './healthy-habits.component';

const routes: Routes = [
  {
    path: '', component: HealthyHabitsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], exports: [RouterModule]
})
export class HealthyHabitsRoutingModule {
}
