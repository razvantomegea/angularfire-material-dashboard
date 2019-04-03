import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { LearnRoutingModule } from './learn-routing.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NutritionComponent } from './nutrition/nutrition.component';
import { FitnessComponent } from './fitness/fitness.component';
import { SleepComponent } from './sleep/sleep.component';
import { VitalityComponent } from './vitality/vitality.component';
import { MicrobiomeComponent } from './microbiome/microbiome.component';
import { EnvironmentComponent } from './environment/environment.component';
import { LearnComponent } from './learn.component';
import { LearnDetailsComponent } from './learn-details/learn-details.component';

@NgModule({
  imports: [
    LearnRoutingModule,
    NativeScriptCommonModule
  ],
  declarations: [NutritionComponent, FitnessComponent, SleepComponent, VitalityComponent, MicrobiomeComponent, EnvironmentComponent, LearnComponent, LearnDetailsComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LearnModule { }
