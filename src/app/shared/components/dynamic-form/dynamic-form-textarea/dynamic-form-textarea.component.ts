import { Component, Input } from '@angular/core';
import { DynamicFormTextareaConfig } from 'app/shared/components/dynamic-form/dynamic-form-textarea/dynamic-form-textarea-config';

@Component({
  selector: 'app-dynamic-form-textarea',
  templateUrl: './dynamic-form-textarea.component.html',
  styleUrls: ['./dynamic-form-textarea.component.scss']
})
export class DynamicFormTextareaComponent {
  @Input() public config: DynamicFormTextareaConfig;

}
