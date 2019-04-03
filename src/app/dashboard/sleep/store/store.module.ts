import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgRxStoreModule } from '@ngrx/store';
import { SleepEffects } from './effects/sleep.effects';
import { reducer } from './reducers';

@NgModule({
  imports: [
    NgRxStoreModule.forFeature('sleep', reducer),
    EffectsModule.forFeature([SleepEffects])
  ],
  declarations: []
})
export class StoreModule {
}
