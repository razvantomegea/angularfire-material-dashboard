import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { FoodDetailsComponent } from './food-details/food-details.component';
import { FoodEditComponent } from './food-edit/food-edit.component';
import { FoodsRoutingModule } from './foods-routing.module';
import { FoodsComponent } from './foods.component';
import { FoodFilterComponent, FoodsListComponent } from './shared';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    FoodsRoutingModule,
    HttpClientModule,
    SharedModule,
    StoreModule
  ],
  declarations: [FoodsComponent, FoodsListComponent, FoodDetailsComponent, FoodFilterComponent, FoodEditComponent]
})
export class FoodsModule {
}
