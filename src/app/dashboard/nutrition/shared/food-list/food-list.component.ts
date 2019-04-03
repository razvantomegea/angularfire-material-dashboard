import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Food, FoodReport } from 'app/dashboard/foods/model';
import { Meal } from 'app/dashboard/nutrition/model';

@Component({
  selector: 'app-nutrition-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.scss']
})
export class FoodListComponent {
  @Input() public dense: boolean;
  @Input() public foods: (Food | FoodReport | Meal)[];

  @Output() private readonly editFood: EventEmitter<Food | FoodReport | Meal> = new EventEmitter();
  @Output() private readonly removeFood: EventEmitter<number> = new EventEmitter();

  public getName(food: Food | FoodReport | Meal): string {
    return (<Food | FoodReport>food).desc ? (<Food | FoodReport>food).desc.name : (<Meal>food).timestamp;
  }

  public onEditFood(food: Food | FoodReport | Meal): void {
    this.editFood.emit(food);
  }

  public onRemoveFood(foodIndex: number): void {
    this.removeFood.emit(foodIndex);
  }
}
