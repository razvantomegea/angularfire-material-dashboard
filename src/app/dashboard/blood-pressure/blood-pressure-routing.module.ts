import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BloodPressureComponent } from './blood-pressure.component';

const routes: Routes = [
  {
    path: '', component: BloodPressureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BloodPressureRoutingModule {
}
