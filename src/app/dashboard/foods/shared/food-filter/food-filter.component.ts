import { Component, EventEmitter, Input, Output } from '@angular/core';
import { USDANutrient } from 'app/dashboard/nutrition/model';

@Component({
  selector: 'app-food-filter',
  templateUrl: './food-filter.component.html',
  styleUrls: ['./food-filter.component.scss']
})
export class FoodFilterComponent {
  @Input() public foodGroups: string[];
  @Input() public nutrients: USDANutrient[];
  public selectedFoodGroup: string;
  public selectedNutrient: string;
  @Output() private readonly filterFoodGroup: EventEmitter<string> = new EventEmitter();
  @Output() private readonly filterNutrient: EventEmitter<string> = new EventEmitter();
  // public readonly nutrientCtrl: FormControl = new FormControl();
  // public readonly separatorKeysCodes: number[] = [ENTER];
  // public filteredNutrients: USDANutrient[];
  // @ViewChild('nutrientAuto') nutrientAuto: MatAutocomplete;
  // @ViewChild('nutrientInput') nutrientInput: ElementRef<HTMLInputElement>;
  // public queriedNutrients: Observable<USDANutrient[]>;
  // public selectedNutrients: USDANutrient[] = [];
  // @Output() private readonly filterNutrients: EventEmitter<USDANutrient[]> = new EventEmitter();

  // constructor() {
  //   this.queriedNutrients = this.nutrientCtrl.valueChanges.pipe(
  //     startWith(null),
  //     map((nutrient: string | null) => nutrient ? <USDANutrient[]>this.query(this.filteredNutrients, nutrient)
  //       : this.filteredNutrients
  //     )
  //   );
  // }
  //
  // public ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.nutrients && changes.nutrients.currentValue) {
  //     this.filteredNutrients = [...this.nutrients];
  //   }
  // }

  public onSelectFoodGroup(): void {
    this.filterFoodGroup.emit(this.selectedFoodGroup);
  }

  public onSelectNutrient(): void {
    this.filterNutrient.emit(this.selectedNutrient);
  }

  // public onAddNutrient(event: MatChipInputEvent): void {
  //   if (!this.nutrientAuto.isOpen) {
  //     const input: HTMLInputElement = event.input;
  //     const value: string = (event.value || '').trim();
  //     const nutrient: USDANutrient = this.filteredNutrients.find((n: USDANutrient) => value === n.name);
  //
  //     if (nutrient) {
  //       this.selectedNutrients.push(nutrient);
  //       this.filterNutrients.emit(this.selectedNutrients);
  //     }
  //
  //     if (input) {
  //       input.value = '';
  //     }
  //
  //     this.nutrientCtrl.setValue(null);
  //     this.filteredNutrients = <USDANutrient[]>this.filter(this.nutrients, this.selectedNutrients);
  //   }
  // }
  //
  // public onRemoveNutrient(nutrient: USDANutrient): void {
  //   const index = this.selectedNutrients.indexOf(nutrient);
  //
  //   if (index >= 0) {
  //     this.selectedNutrients.splice(index, 1);
  //     this.filterNutrients.emit(this.selectedNutrients);
  //   }
  //
  //   this.filteredNutrients = <USDANutrient[]>this.filter(this.nutrients, this.selectedNutrients);
  // }

  // public onSelectedNutrient(event: MatAutocompleteSelectedEvent): void {
  //   const selected: string = event.option.value;
  //
  //   if (!this.selectedNutrients.find((n: USDANutrient) => n.id === selected)) {
  //     this.selectedNutrients.push(this.filteredNutrients.find((n: USDANutrient) => n.id === selected));
  //     this.filterNutrients.emit(this.selectedNutrients);
  //   }
  //
  //   this.nutrientInput.nativeElement.value = '';
  //   this.nutrientCtrl.setValue(null);
  //   this.filteredNutrients = <USDANutrient[]>this.filter(this.nutrients, this.selectedNutrients);
  // }
  //
  // private filter(all: (string | USDANutrient)[], selected: (string | USDANutrient)[]): (string | USDANutrient)[] {
  //   return all.filter((el: string | USDANutrient) => !selected.find((selectedEl: string | USDANutrient) => typeof selectedEl === 'string'
  //     ? <string>selectedEl === <string>el : (<USDANutrient>selectedEl).id === (<USDANutrient>el).id));
  // }
  //
  // private query(arr: (string | USDANutrient)[], value: string): (string | USDANutrient)[] {
  //   const filteredValue: string = value.toLowerCase().trim();
  //
  //   return arr.filter((el: string | USDANutrient) => {
  //     if (typeof el === 'string') {
  //       return (<string>el).toLowerCase().includes(filteredValue);
  //     }
  //
  //     return (<USDANutrient>el).name.toLowerCase().includes(filteredValue);
  //   });
  // }
}
