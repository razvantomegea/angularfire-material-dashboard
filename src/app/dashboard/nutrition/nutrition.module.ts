import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { MealEditDetailsComponent, MealEditDetailsDialogComponent } from './meal-edit/core';
import { MealEditComponent } from './meal-edit/meal-edit.component';
import { NutritionRoutingModule } from './nutrition-routing.module';
import { NutritionComponent } from './nutrition.component';
import { FoodListComponent, FoodSelectComponent, NutritionDetailsComponent } from './shared';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    NutritionRoutingModule,
    StoreModule,
    SharedModule
  ],
  declarations: [
    NutritionComponent,
    MealEditComponent,
    NutritionDetailsComponent,
    FoodListComponent,
    FoodSelectComponent,
    MealEditDetailsComponent,
    MealEditDetailsDialogComponent
  ],
  entryComponents: [MealEditDetailsDialogComponent]
})
export class NutritionModule {
}
