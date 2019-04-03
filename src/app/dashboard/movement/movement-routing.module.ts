import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MovementComponent } from './movement.component';
import { SessionEditComponent } from './session-edit/session-edit.component';

const routes: Routes = [
  {
    path: '', component: MovementComponent
  },
  {
    path: 'sessions/:id', component: SessionEditComponent
  },
  {
    path: 'sessions/new', component: SessionEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovementRoutingModule {
}
