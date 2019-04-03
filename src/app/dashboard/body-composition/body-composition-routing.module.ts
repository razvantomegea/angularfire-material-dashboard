import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BodyCompositionComponent } from './body-composition.component';

const routes: Routes = [
  {
    path: '', component: BodyCompositionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], exports: [RouterModule]
})
export class BodyCompositionRoutingModule {
}
