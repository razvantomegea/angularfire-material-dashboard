import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BloodLipidsComponent } from './blood-lipids.component';

const routes: Routes = [
  {
    path: '', component: BloodLipidsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BloodLipidsRoutingModule {
}
