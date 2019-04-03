import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { BloodKetonesEffects } from './effects/blood-ketones.effects';
import { reducer } from './reducers';

@NgModule({
  imports: [
    NgRxStoreModule.forFeature('blood-ketones', reducer),
    EffectsModule.forFeature([BloodKetonesEffects])
  ],
  declarations: []
})
export class StoreModule {
}
