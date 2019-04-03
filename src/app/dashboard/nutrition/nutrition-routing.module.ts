import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MealEditComponent } from 'app/dashboard/nutrition/meal-edit/meal-edit.component';
import { NutritionComponent } from './nutrition.component';

const routes: Routes = [
  {
    path: '', component: NutritionComponent
  },
  {
    path: 'meals/:id', component: MealEditComponent
  },
  {
    path: 'meals/new', component: MealEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NutritionRoutingModule { }
