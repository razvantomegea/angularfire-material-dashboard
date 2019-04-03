import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from 'env/environment';
import { AppEffects } from './app.effects';
import { metaReducers, reducers } from './app.reducers';
import { BodyCompositionEffects } from './body-composition/effects/body-composition.effects';
import { LayoutEffects } from './layout/effects/layout.effects';
import { CustomRouteSerializer } from './router/reducers';
import { UserEffects } from './user/effects/user.effects';

@NgModule({
  imports: [
    !environment.production ? StoreDevtoolsModule.instrument({
      maxAge: 50, logOnly: environment.production
    }) : [],
    !environment.production ? NgRxStoreModule.forRoot(reducers, { metaReducers }) : NgRxStoreModule.forRoot(reducers),
    EffectsModule.forRoot([AppEffects, BodyCompositionEffects, LayoutEffects, UserEffects]),
    StoreRouterConnectingModule.forRoot({ stateKey: 'router' })
  ], declarations: [], providers: [
    {
      provide: RouterStateSerializer,
      useClass: CustomRouteSerializer
    }
  ]
})
export class StoreModule {
}
