import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LearnDetailsComponent } from './learn-details/learn-details.component';

import { LearnComponent } from './learn.component';

const routes: Routes = [
  {
    path: ':subject', component: LearnDetailsComponent
  },
  {
    path: '', component: LearnComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule {
}
