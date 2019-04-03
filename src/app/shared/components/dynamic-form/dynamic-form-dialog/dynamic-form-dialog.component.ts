import { Component, OnChanges } from '@angular/core';

import { DynamicFormService } from 'app/core/services/dynamic-form.service';
import { DynamicFormComponent } from '../dynamic-form.component';

@Component({
  selector: 'app-dynamic-form-dialog',
  templateUrl: './dynamic-form-dialog.component.html',
  styleUrls: ['./dynamic-form-dialog.component.scss']
})
export class DynamicFormDialogComponent<T> extends DynamicFormComponent<T> implements OnChanges {
  constructor(protected dynamicFormService: DynamicFormService) {
    super(dynamicFormService);
  }
}
