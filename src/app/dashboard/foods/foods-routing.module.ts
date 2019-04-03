import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FoodEditComponent } from 'app/dashboard/foods/food-edit/food-edit.component';
import { FoodDetailsComponent } from './food-details/food-details.component';

import { FoodsComponent } from './foods.component';

const routes: Routes = [
  {
    path: 'new', component: FoodEditComponent
  },
  {
    path: ':id/edit', component: FoodEditComponent
  },
  {
    path: 'usda/:id', component: FoodDetailsComponent
  },
  {
    path: ':id', component: FoodDetailsComponent
  },
  {
    path: '', component: FoodsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], exports: [RouterModule]
})
export class FoodsRoutingModule {
}
