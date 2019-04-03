import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BloodGlucoseComponent } from './blood-glucose.component';

const routes: Routes = [
  {
    path: '', component: BloodGlucoseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BloodGlucoseRoutingModule {
}
