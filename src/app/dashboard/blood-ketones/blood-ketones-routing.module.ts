import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BloodKetonesComponent } from './blood-ketones.component';

const routes: Routes = [
  {
    path: '', component: BloodKetonesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BloodKetonesRoutingModule {
}
