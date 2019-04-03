import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Meal } from 'app/dashboard/nutrition/model';
import { take } from 'app/shared/utils/rxjs-exports';
import { MealEditDetailsDialogComponent, MealEditDetailsDialogData } from '../meal-edit-details-dialog/meal-edit-details-dialog.component';

@Component({
  selector: 'app-meal-edit-details',
  templateUrl: './meal-edit-details.component.html',
  styleUrls: ['./meal-edit-details.component.scss']
})
export class MealEditDetailsComponent {
  public isOverflown = false;
  @Input() public meal: Meal;
  @Output() private readonly cancel: EventEmitter<void> = new EventEmitter();
  @Output() private readonly delete: EventEmitter<void> = new EventEmitter();
  @Output() private readonly favoriteChange: EventEmitter<void> = new EventEmitter();
  @Output() private readonly save: EventEmitter<void> = new EventEmitter();
  @Output() private readonly update: EventEmitter<Meal> = new EventEmitter();

  constructor(private dialog: MatDialog) {
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  public onDelete(): void {
    this.delete.emit();
  }

  public onFavoritesChange(): void {
    this.favoriteChange.emit();
  }

  public onMealDetailsUpdate(): void {
    this.dialog.open(MealEditDetailsDialogComponent, {
      closeOnNavigation: true, data: this.meal, disableClose: true, maxWidth: '600px'
    }).afterClosed().pipe(take(1)).toPromise().then((data: MealEditDetailsDialogData) => {
      if (data && data.isDirty) {
        const newMeal = new Meal(
          data.timestamp,
          data.name,
          this.meal.foods,
          this.meal.remainingNutrition,
          this.meal.nutrition,
          this.meal.metrics,
          this.meal.quantity,
          this.meal.unit
        );
        newMeal.notes = data.notes;
        this.update.emit(newMeal);
      }
    });
  }

  public onMouseEnter(event: Event): void {
    const nodeEl: HTMLElement = <HTMLElement>event.target;
    this.isOverflown = nodeEl.scrollWidth > nodeEl.offsetWidth || nodeEl.scrollHeight > nodeEl.offsetHeight;
  }

  public onSave(): void {
    this.save.emit();
  }
}
