import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BloodHomocysteineComponent } from './blood-homocysteine.component';

const routes: Routes = [
  {
    path: '', component: BloodHomocysteineComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BloodHomocysteineRoutingModule {
}
