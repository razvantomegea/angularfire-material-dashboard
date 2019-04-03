import { Component, Input } from '@angular/core';
import { DynamicFormSelectConfig } from './dynamic-form-select-config';

@Component({
  selector: 'app-dynamic-form-select',
  templateUrl: './dynamic-form-select.component.html',
  styleUrls: ['./dynamic-form-select.component.scss']
})
export class DynamicFormSelectComponent {
  @Input() public config: DynamicFormSelectConfig;

  public isVisible(): boolean {
    return typeof this.config.conditionalShow === 'function' && this.config.conditionalShow() || this.config.conditionalShow === true ||
      this.config.conditionalShow === undefined;
  }
}
