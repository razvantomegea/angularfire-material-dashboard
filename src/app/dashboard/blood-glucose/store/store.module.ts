import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { BloodGlucoseEffects } from './effects/blood-glucose.effects';
import { reducer } from './reducers';

@NgModule({
  imports: [
    NgRxStoreModule.forFeature('blood-glucose', reducer),
    EffectsModule.forFeature([BloodGlucoseEffects])
  ],
  declarations: []
})
export class StoreModule {
}
