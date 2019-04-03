import { ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { AppErrorHandler } from './app-error-handler';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { BodyCompositionCalculationsComponent, BodyCompositionMeasurementsComponent } from './dashboard/body-composition/core';
import { ExerciseDetailsComponent } from './dashboard/exercises/exercise-details/exercise-details.component';
import { ExerciseCardComponent } from './dashboard/exercises/shared/exercise-card/exercise-card.component';
import { FoodEditComponent } from './dashboard/foods/food-edit/food-edit.component';
import { FoodFilterComponent } from './dashboard/foods/shared';
import { SessionEditDetailsDialogComponent } from './dashboard/movement/session-edit/core/session-edit-details-dialog/session-edit-details-dialog.component';
import { SessionEditDetailsComponent } from './dashboard/movement/session-edit/core/session-edit-details/session-edit-details.component';
import { SessionEditComponent } from './dashboard/movement/session-edit/session-edit.component';
import { ActivityListComponent } from './dashboard/movement/shared/activity-list/activity-list.component';
import { ActivitySelectComponent } from './dashboard/movement/shared/activity-select/activity-select.component';
import { MealEditDetailsComponent, MealEditDetailsDialogComponent } from './dashboard/nutrition/meal-edit/core';
import { MealEditComponent } from './dashboard/nutrition/meal-edit/meal-edit.component';
import { FoodListComponent, FoodSelectComponent, NutritionDetailsComponent } from './dashboard/nutrition/shared';
import { TrendsFilterDialogComponent } from './dashboard/shared';
import { SleepDetailsDialogComponent } from './dashboard/sleep/core';
import { PromptDialogComponent } from './shared/components';
import { DynamicFormComponent } from './shared/components/dynamic-form';
import { DynamicFormCheckboxComponent } from './shared/components/dynamic-form/dynamic-form-checkbox';
import { DynamicFormDatepickerComponent } from './shared/components/dynamic-form/dynamic-form-datepicker';
import { DynamicFormDialogComponent } from './shared/components/dynamic-form/dynamic-form-dialog';
import { DynamicFormGroupComponent } from './shared/components/dynamic-form/dynamic-form-group';
import { DynamicFormInputComponent } from './shared/components/dynamic-form/dynamic-form-input';
import { DynamicFormSelectComponent } from './shared/components/dynamic-form/dynamic-form-select';
import { DynamicFormSelectionListComponent } from './shared/components/dynamic-form/dynamic-form-selection-list';
import { DynamicFormTextareaComponent } from './shared/components/dynamic-form/dynamic-form-textarea';
import { DynamicFormTimepickerComponent } from './shared/components/dynamic-form/dynamic-form-timepicker';

@NgModule({
  declarations: [
    AppComponent,
    MealEditComponent,
    NutritionDetailsComponent,
    FoodListComponent,
    FoodSelectComponent,
    FoodFilterComponent,
    BodyCompositionCalculationsComponent,
    BodyCompositionMeasurementsComponent,
    PromptDialogComponent,
    MealEditDetailsComponent,
    MealEditDetailsDialogComponent,
    FoodEditComponent,
    TrendsFilterDialogComponent,
    SessionEditComponent,
    SessionEditDetailsComponent,
    SessionEditDetailsDialogComponent,
    ActivityListComponent,
    ActivitySelectComponent,
    SleepDetailsDialogComponent,
    SleepQualityQuestionnaireComponent,
    DynamicFormComponent,
    DynamicFormInputComponent,
    DynamicFormCheckboxComponent,
    DynamicFormSelectComponent,
    DynamicFormSelectionListComponent,
    DynamicFormDatepickerComponent,
    DynamicFormGroupComponent,
    DynamicFormDialogComponent,
    DynamicFormTextareaComponent,
    DynamicFormTimepickerComponent,
    ExerciseCardComponent,
    ExerciseDetailsComponent
  ],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    CoreModule
  ],
  providers: [{ provide: ErrorHandler, useClass: AppErrorHandler }],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
