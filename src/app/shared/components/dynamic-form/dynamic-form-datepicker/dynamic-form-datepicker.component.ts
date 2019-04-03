import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DynamicFormDatepickerConfig } from 'app/shared/components/dynamic-form';

@Component({
  selector: 'app-dynamic-form-datepicker',
  templateUrl: './dynamic-form-datepicker.component.html',
  styleUrls: ['./dynamic-form-datepicker.component.scss']
})
export class DynamicFormDatepickerComponent {
  @Input() public classes: string[];
  @Input() public config: DynamicFormDatepickerConfig;
  @Input() public control: AbstractControl;

}
