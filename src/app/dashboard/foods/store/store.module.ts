import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { FoodsEffects } from './effects/foods.effects';
import { reducer } from './reducers';

@NgModule({
  imports: [
    NgRxStoreModule.forFeature('foods', reducer),
    EffectsModule.forFeature([FoodsEffects])
  ],
  declarations: []
})
export class StoreModule {
}
