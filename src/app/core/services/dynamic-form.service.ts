import { Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import {
  CheckboxConfig,
  DynamicFormConfig,
  DynamicFormDatepickerConfig,
  DynamicFormGroupConfig,
  DynamicFormInputConfig,
  DynamicFormSelectConfig,
  DynamicFormSelectionListConfig,
  DynamicFormTextareaConfig,
  DynamicFormTimepickerConfig,
  DynamicFormValidation
} from 'app/shared/components/dynamic-form';
import { isNil } from 'app/shared/utils/lodash-exports';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  constructor() {
  }

  public mapConfigToValue(config: DynamicFormConfig[], value: any, valueMap: any = {}): any {
    config.forEach((c: DynamicFormConfig) => {
      if (!!value && Reflect.has(value, c.formControlName)) {
        valueMap[c.formControlName] = value[c.formControlName];

        if (isNil(valueMap[c.formControlName])) {
          valueMap[c.formControlName] = '';
        }
      } else if ((<DynamicFormGroupConfig>c).configs) {
        valueMap[c.formControlName] = {};
        return this.mapConfigToValue((<DynamicFormGroupConfig>c).configs, value, valueMap[c.formControlName]);
      } else {
        valueMap[c.formControlName] = '';
      }
    });

    return valueMap;
  }

  /**
   * @desc Serializes JSON form configurations to form controls
   * @param {DynamicFormConfig[]} configs
   * @returns {FormGroup}
   */
  public serializeFormConfigs(configs: DynamicFormConfig[]): FormGroup {
    const formGroup: FormGroup = new FormGroup({});
    configs.forEach((config: DynamicFormConfig) => {
      const setupControlMethod = `setup${config.type}Control`;

      if (typeof this[setupControlMethod] !== 'function') {
        formGroup.addControl(config.formControlName, new FormControl({
          value: config.value,
          disabled: config.state && config.state.disabled ? config.state.disabled : false
        }, this.composeValidators(config.validations)));
      }

      const control: FormControl | FormGroup = this[setupControlMethod](config);

      if (control) {
        formGroup.addControl(config.formControlName, control);
      }
    });

    return formGroup;
  }

  /**
   * @desc Creates form validators from JSON validations configurations
   * @param {DynamicFormValidation[]} validations
   * @returns {ValidatorFn}
   */
  private composeValidators(validations: DynamicFormValidation[] = []): ValidatorFn {
    const validators: ValidatorFn[] = validations.map((validation: DynamicFormValidation) => {
      switch (validation.name) {
        case 'required':
          return Validators.required;
        case 'minLength':
          return Validators.minLength(parseInt(validation.expression, 10));
        case 'maxLength':
          return Validators.maxLength(parseInt(validation.expression, 10));
        case 'min':
          return Validators.min(parseInt(validation.expression, 10));
        case 'max':
          return Validators.max(parseInt(validation.expression, 10));
        case 'pattern':
          return Validators.pattern(new RegExp(validation.expression));
        case 'noMatch':
          return validation.func;
        default:
          return;
      }
    });

    return Validators.compose(validators);
  }

  /**
   * @desc Create Checkbox form control
   * @param {CheckboxConfig} config
   * @returns {FormControl}
   */
  private setupCheckboxControl(config: CheckboxConfig): FormControl {
    return new FormControl({
      value: config.value,
      disabled: config.state.disabled
    }, this.composeValidators(config.validations));
  }

  /**
   * @desc Create Datepicker form control
   * @param {DynamicFormDatepickerConfig} config
   * @returns {FormControl}
   */
  private setupDatepickerControl(config: DynamicFormDatepickerConfig): FormControl {
    return new FormControl({
      value: config.value,
      disabled: config.state.disabled
    }, this.composeValidators(config.validations));
  }

  /**
   * @desc Create form group
   * @param {DynamicFormGroupConfig} config
   * @returns {FormGroup}
   */
  private setupFormGroupControl(config: DynamicFormGroupConfig): FormGroup {
    return this.serializeFormConfigs(config.configs);
  }

  /**
   * @desc Create Input form control
   * @param {DynamicFormInputConfig} config
   * @returns {FormControl}
   */
  private setupInputControl(config: DynamicFormInputConfig): FormControl {
    return new FormControl({
      value: config.value,
      disabled: config.state.disabled
    }, this.composeValidators(config.validations));
  }

  /**
   * @desc Setup Select form control
   * @param {DynamicFormSelectConfig} config
   * @returns {FormControl}
   */
  private setupSelectControl(config: DynamicFormSelectConfig): FormControl {
    return new FormControl({
      value: config.value,
      disabled: config.state ? config.state.disabled : false
    }, this.composeValidators(config.validations));
  }

  /**
   * @desc Setup Selection list form control
   * @param {DynamicFormSelectionListConfig} config
   * @returns {FormControl}
   */
  private setupSelectionListControl(config: DynamicFormSelectionListConfig): FormControl {
    return new FormControl({
      value: config.value,
      disabled: config.state ? config.state.disabled : false
    }, this.composeValidators(config.validations));
  }

  /**
   * @desc Setup Textarea form control
   * @param {DynamicFormTextareaConfig} config
   * @returns {FormControl}
   */
  private setupTextareaControl(config: DynamicFormTextareaConfig): FormControl {
    return new FormControl({
      value: config.value,
      disabled: config.state ? config.state.disabled : false
    }, this.composeValidators(config.validations));
  }

  /**
   * @desc Create Timepicker form control
   * @param {DynamicFormTimepickerConfig} config
   * @returns {FormControl}
   */
  private setupTimepickerControl(config: DynamicFormTimepickerConfig): FormControl {
    return new FormControl({
      value: config.value,
      disabled: config.state.disabled
    }, this.composeValidators(config.validations));
  }
}
