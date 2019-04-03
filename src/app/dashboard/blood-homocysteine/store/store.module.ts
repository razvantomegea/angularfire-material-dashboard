import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { BloodHomocysteineEffects } from './effects/blood-homocysteine.effects';
import { reducer } from './reducers';

@NgModule({
  imports: [
    NgRxStoreModule.forFeature('blood-homocysteine', reducer),
    EffectsModule.forFeature([BloodHomocysteineEffects])
  ],
  declarations: []
})
export class StoreModule {
}
