import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DynamicFormSelectionListConfig, SelectionListOption } from './dynamic-form-selection-list-config';

@Component({
  selector: 'app-dynamic-form-selection-list',
  templateUrl: './dynamic-form-selection-list.component.html',
  styleUrls: ['./dynamic-form-selection-list.component.scss']
})
export class DynamicFormSelectionListComponent {
  @Input() public config: DynamicFormSelectionListConfig;
  @Input() public control: FormControl;

  public onSelect(option: SelectionListOption): void {
    if (!this.config.multiSelection) {
      this.control.setValue([option.value]);
    }
  }
}
