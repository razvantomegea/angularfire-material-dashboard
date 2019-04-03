import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SleepComponent } from './sleep.component';

const routes: Routes = [
  {
    path: '', component: SleepComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SleepRoutingModule { }
