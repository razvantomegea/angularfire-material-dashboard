import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicFormSelectionListComponent } from 'app/shared/components/dynamic-form/dynamic-form-selection-list';
import { Ng2TelInput } from 'ng2-tel-input';

import { DynamicFormCheckboxComponent } from './dynamic-form-checkbox';
import { DynamicFormDatepickerComponent } from './dynamic-form-datepicker';
import { DynamicFormGroupComponent } from './dynamic-form-group';
import { DynamicFormInputComponent, DynamicFormInputConfig } from './dynamic-form-input';
import { DynamicFormSelectComponent } from './dynamic-form-select';
import { DynamicFormTextareaComponent } from './dynamic-form-textarea';
import { DynamicFormTimepickerComponent } from './dynamic-form-timepicker';
import { DynamicFormConfig, DynamicFormFieldTypes } from './models';

const DYNAMIC_FORM_COMPONENTS = {
  [DynamicFormFieldTypes.Checkbox]: DynamicFormCheckboxComponent,
  [DynamicFormFieldTypes.Datepicker]: DynamicFormDatepickerComponent,
  [DynamicFormFieldTypes.FormGroup]: DynamicFormGroupComponent,
  [DynamicFormFieldTypes.Input]: DynamicFormInputComponent,
  [DynamicFormFieldTypes.Select]: DynamicFormSelectComponent,
  [DynamicFormFieldTypes.SelectionList]: DynamicFormSelectionListComponent,
  [DynamicFormFieldTypes.Textarea]: DynamicFormTextareaComponent,
  [DynamicFormFieldTypes.Timepicker]: DynamicFormTimepickerComponent
};

@Directive({
  selector: '[appDynamicFormField]'
})
export class DynamicFormFieldDirective implements OnInit {
  @Input() public classes: string[];
  public component: ComponentRef<any>;
  @Input() public config: DynamicFormConfig;
  @Input() public control: FormControl;
  @Input() public group: FormGroup;

  constructor(private container: ViewContainerRef, private resolver: ComponentFactoryResolver) {
  }

  public ngOnInit(): void {
    const component = DYNAMIC_FORM_COMPONENTS[this.config.type];
    const factory = this.resolver.resolveComponentFactory(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.classes = this.classes;
    this.component.instance.config = this.config;
    this.component.instance.control = this.control;
    this.component.instance.group = this.group;

    if ((<DynamicFormInputConfig>this.config).inputType === 'tel') {
      this.component.instance.ng2TelInput = new Ng2TelInput(this.component.instance.formInput);
      this.component.instance.ng2TelInput.ngOnInit();
    }
  }
}
