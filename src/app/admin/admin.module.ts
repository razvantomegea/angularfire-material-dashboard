import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AuthFormComponent } from 'app/admin/shared';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AuthComponent } from './auth/auth.component';
import { AdminEffects } from './store/effects/admin.effects';
import { reducer } from './store/reducers';

@NgModule({
  imports: [
    AdminRoutingModule,
    EffectsModule.forRoot([AdminEffects]),
    SharedModule,
    StoreModule.forFeature('admin', reducer)
  ], declarations: [
    AuthComponent, AuthFormComponent
  ]
})
export class AdminModule {
}
