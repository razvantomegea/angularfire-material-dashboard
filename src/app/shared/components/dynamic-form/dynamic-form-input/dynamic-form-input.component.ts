import { AfterContentInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { auth } from 'firebase/app';
import 'intl-tel-input';
import 'intl-tel-input/build/js/utils';
import * as $ from 'jquery';

import { DynamicFormInputConfig } from './dynamic-form-input-config';

@Component({
  selector: 'app-dynamic-form-input',
  templateUrl: './dynamic-form-input.component.html',
  styleUrls: ['./dynamic-form-input.component.scss']
})
export class DynamicFormInputComponent implements AfterContentInit, OnChanges {
  @Input() public classes: string[];
  @Input() public config: DynamicFormInputConfig;
  @Input() public control: AbstractControl;
  public reCaptchaVerified = false;
  @ViewChild('formInput') protected formInput: ElementRef;
  private readonly windowRef: any = window;

  public ngAfterContentInit(): void {
    setTimeout(() => {
      const formInput = $(this.formInput.nativeElement);

      if (this.config.inputType === 'tel') {
        this.setupReCaptcha();
        formInput.intlTelInput('setNumber', this.config.value);
      }
    }, 10);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.config && changes.config.currentValue) {
      this.config.validations[1].func = this.validatePhone.bind(this);
    }
  }

  private setupReCaptcha(): void {
    this.windowRef.recaptchaVerifier = new auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'normal', 'callback': () => {
        this.reCaptchaVerified = true;
        this.config.onrReCaptchaVerified(this.reCaptchaVerified);
      }, 'expired-callback': () => {
        this.reCaptchaVerified = false;
        this.windowRef.recaptchaVerifier.reset(this.windowRef.recaptchaWidgetId);
        this.config.onrReCaptchaVerified(this.reCaptchaVerified);
      }
    });
    this.windowRef.recaptchaVerifier.render().then((widgetId: string) => {
      this.windowRef.recaptchaWidgetId = widgetId;
    });
    this.config.onrReCaptchaInit(this.windowRef.recaptchaVerifier);
  }

  private validatePhone(): { isInvalid: boolean } {
    if (this.formInput) {
      const formInput = $(this.formInput.nativeElement);
      return !formInput.intlTelInput('isValidNumber') ? { isInvalid: true } : null;
    }

    return null;
  }
}
