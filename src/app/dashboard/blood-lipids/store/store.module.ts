import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { BloodLipidsEffects } from './effects/blood-lipids.effects';
import { reducer } from './reducers';

@NgModule({
  imports: [
    NgRxStoreModule.forFeature('blood-lipids', reducer),
    EffectsModule.forFeature([BloodLipidsEffects])
  ],
  declarations: []
})
export class StoreModule {
}
