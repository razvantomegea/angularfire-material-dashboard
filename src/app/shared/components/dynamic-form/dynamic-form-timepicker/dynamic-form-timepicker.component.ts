import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DynamicFormTimepickerConfig } from 'app/shared/components/dynamic-form';

@Component({
  selector: 'app-dynamic-form-timepicker',
  templateUrl: './dynamic-form-timepicker.component.html',
  styleUrls: ['./dynamic-form-timepicker.component.scss']
})
export class DynamicFormTimepickerComponent {
  @Input() public classes: string[];
  @Input() public config: DynamicFormTimepickerConfig;
  @Input() public control: AbstractControl;
}
