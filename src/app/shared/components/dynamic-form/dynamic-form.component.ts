import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { DynamicFormService } from 'app/core/services/dynamic-form.service';
import { ComponentDestroyed } from 'app/shared/mixins';
import { Subscription, takeUntil } from 'app/shared/utils/rxjs-exports';
import { DynamicFormConfig, FlexboxConfig } from './models';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent<T> extends ComponentDestroyed implements OnChanges, AfterContentInit {
  @Input() protected initialData: T;
  @Input() protected isCardContent: boolean;
  @Input() public classes: string[];
  @Input() public configs: DynamicFormConfig[];
  @Input() public flex: FlexboxConfig;
  @Input() public flexLayout: FlexboxConfig = { default: 'column' };
  @Input() public flexLayoutAlign: FlexboxConfig = { default: 'start' };
  @Input() public flexLayoutGap: FlexboxConfig = { default: '0px' };

  @Output() protected readonly created: EventEmitter<FormGroup> = new EventEmitter();
  @Output() protected readonly submitted: EventEmitter<T> = new EventEmitter();
  @Output() protected readonly valueChange: EventEmitter<T> = new EventEmitter();

  public form: FormGroup;

  protected formValueSubscription: Subscription;

  constructor(protected dynamicFormService: DynamicFormService) {
    super();
  }

  public ngAfterContentInit(): void {
    if (this.initialData) {
      this.form.setValue(this.initialData);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.configs && changes.configs.currentValue) {
      this.form = this.setupForm();
      this.created.emit(this.form);

      if (this.formValueSubscription) {
        this.formValueSubscription.unsubscribe();
      }

      this.formValueSubscription = this.form.valueChanges.pipe(takeUntil(this.isDestroyed$)).subscribe((formValueChanges: any) => {
        this.valueChange.emit(formValueChanges);
      });
    }
  }

  public onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.form.valid) {
      // getRawValue() includes the values of disabled controls
      this.submitted.emit(this.form.getRawValue());
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  private setupForm(): FormGroup {
    return this.dynamicFormService.serializeFormConfigs(this.configs);
  }

  private validateAllFormFields(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((field: string) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }
}
