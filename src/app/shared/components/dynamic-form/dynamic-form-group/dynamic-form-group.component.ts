import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { DynamicFormGroupConfig } from './dynamic-form-group-config';

@Component({
  selector: 'app-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  styleUrls: ['./dynamic-form-group.component.scss']
})
export class DynamicFormGroupComponent {
  @Input() public config: DynamicFormGroupConfig;
  @Input() public control: AbstractControl;
}
