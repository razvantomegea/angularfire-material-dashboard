import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { MovementEffects } from './effects/movement.effects';
import { reducer } from './reducers';

@NgModule({
  imports: [
    NgRxStoreModule.forFeature('movement', reducer),
    EffectsModule.forFeature([MovementEffects])
  ],
  declarations: []
})
export class StoreModule {
}
