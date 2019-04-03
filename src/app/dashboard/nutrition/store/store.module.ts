import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { NutritionEffects } from './effects/nutrition.effects';
import { reducer } from './reducers';

@NgModule({
  imports: [
    NgRxStoreModule.forFeature('nutrition', reducer),
    EffectsModule.forFeature([NutritionEffects])
  ],
  declarations: []
})
export class StoreModule {
}
