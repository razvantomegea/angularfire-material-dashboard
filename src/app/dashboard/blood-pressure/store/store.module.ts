import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { BloodPressureEffects } from './effects/blood-pressure.effects';
import { reducer } from './reducers';

@NgModule({
  imports: [
    NgRxStoreModule.forFeature('blood-pressure', reducer),
    EffectsModule.forFeature([BloodPressureEffects])
  ],
  declarations: []
})
export class StoreModule {
}
