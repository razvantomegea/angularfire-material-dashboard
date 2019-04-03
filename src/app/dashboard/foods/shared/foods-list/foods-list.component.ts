import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FoodSearch, FoodSort } from '../../model';

@Component({
  selector: 'app-foods-list',
  templateUrl: './foods-list.component.html',
  styleUrls: ['./foods-list.component.scss']
})
export class FoodsListComponent implements OnChanges {
  public dataSource: MatTableDataSource<FoodSearch>;
  public displayedColumns: string[];
  public hasGroup: boolean;
  public hasManufacturer: boolean;
  public hasNutrients: boolean;
  @Input() public isPending: boolean;
  @Input() public list: FoodSearch[];
  @Input() public noData: boolean;
  public selectedNutrient = '';
  @Output() private readonly select: EventEmitter<FoodSearch> = new EventEmitter();
  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.list && changes.list.currentValue) {
      this.setupDataSource();
    }
  }

  public getNutrientValue(row: FoodSort): string {
    if (!row.nutrients) {
      return '';
    }

    const nutrient = row.nutrients[0];

    setTimeout(() => {
      this.selectedNutrient = nutrient ? nutrient.nutrient : '';
    });

    return nutrient ? `${nutrient.gm}g/100g` : '';
  }

  public onFoodItemClick(item: FoodSearch): void {
    this.select.emit(item);
  }

  private setupDataSource(): void {
    this.hasManufacturer = !!this.list.find((food: FoodSearch | FoodSort) => Reflect.has(food, 'manu'));
    this.hasGroup = !!this.list.find((food: FoodSearch | FoodSort) => Reflect.has(food, 'group'));
    this.hasNutrients = !!this.list.find((food: FoodSearch | FoodSort) => Reflect.has(food, 'nutrients'));

    if (this.hasManufacturer && this.hasGroup) {
      this.displayedColumns = ['name', 'manu', 'group'];
    } else if (this.hasManufacturer) {
      this.displayedColumns = ['name', 'manu'];
    } else if (this.hasGroup) {
      this.displayedColumns = ['name', 'group'];
    } else if (this.hasNutrients) {
      this.displayedColumns = ['name', 'nutrient'];
    }

    setTimeout(() => {
      this.dataSource = new MatTableDataSource<FoodSearch>(this.list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
