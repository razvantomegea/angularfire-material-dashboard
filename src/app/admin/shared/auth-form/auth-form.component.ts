import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

import { Credentials } from 'app/admin/model/credentials';
import { NotificationService } from 'app/core/services';
import { DynamicFormInputConfig, FlexboxConfig } from 'app/shared/components/dynamic-form';
import { ComponentDestroyed } from 'app/shared/mixins';
import { auth, FirebaseError } from 'firebase/app';

import { PhoneCredentials } from '../../model';
import {
  AuthService,
  CONFIRM_CODE_FORM_CONFIG,
  EMAIL_FORM_CONFIG,
  PASSWORD_CONFIRM_FORM_CONFIG,
  PASSWORD_FORM_CONFIG,
  PHONE_FORM_CONFIG,
  USERNAME_FORM_CONFIG
} from '../../services';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent extends ComponentDestroyed implements OnChanges, OnDestroy {
  public authForm: FormGroup;
  @Input() public credentials: Credentials | PhoneCredentials;
  @Input() public disabled: boolean;
  public formClasses: string[] = ['mat-card-content', 'auth__content'];
  public formConfigs: DynamicFormInputConfig[];
  public formLayout: FlexboxConfig = { default: 'column' };
  public reCaptchaVerified = false;
  public submitButtonText = '';
  public title = '';
  @Output() private readonly formError: EventEmitter<FirebaseError | TypeError | Error | SyntaxError> = new EventEmitter();
  @Output() private readonly reAuth: EventEmitter<string> = new EventEmitter();
  @Output() private readonly socialAuth: EventEmitter<string> = new EventEmitter();
  @Output() private readonly submit: EventEmitter<{ credentials: Credentials | PhoneCredentials; type: string }> = new EventEmitter();
  private authCredentials: Credentials | PhoneCredentials;
  private recaptchaVerifier: auth.ApplicationVerifier;
  @Input() private type: string;

  constructor(private authService: AuthService, private notificationService: NotificationService) {
    super();
    this.setupForm();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.type && changes.type.currentValue) {
      this.setupForm();
    }

    if (changes.disabled && this.authForm) {
      if (changes.disabled.currentValue === true) {
        this.authForm.disable();
      } else {
        this.authForm.enable();
      }
    }

    if (changes.credentials && changes.credentials.currentValue) {
      this.handleCredentialChange();
    }
  }

  public isLogin(): boolean {
    return this.type === 'login';
  }

  public isPasswordReset(): boolean {
    return this.type === 'password-reset';
  }

  public isPhoneConfirmCode(): boolean {
    return this.type === 'phone-confirm';
  }

  public isPhoneVerify(): boolean {
    return this.type === 'phone-number';
  }

  public isRegistration(): boolean {
    return this.type === 'registration';
  }

  public onFormCreated(form: FormGroup): void {
    this.authForm = form;
  }

  public onReAuth(authMethod: string): void {
    this.reAuth.emit(authMethod);
  }

  public onResendCode(): void {
    this.type = 'phone-number';
    this.setupForm();
  }

  public onSocialAuth(authMethod: string): void {
    this.socialAuth.emit(authMethod);
  }

  public onSubmit(): void {
    if (this.authForm.valid) {
      if (this.isPhoneVerify() && !this.reCaptchaVerified) {
        this.notificationService.showError('Please confirm reCaptcha!');
      } else {
        if (this.isPhoneVerify()) {
          this.handlePhoneVerification();
        } else {
          if (this.isPhoneConfirmCode()) {
            this.handleConfirmationCode();
          } else {
            this.handleEmailSubmit();
          }

          this.submit.emit({
            credentials: this.authCredentials, type: this.type
          });
        }
      }
    }
  }

  private confirmPhone(authCredentials: PhoneCredentials): void {
    this.authService.confirmPhone(authCredentials)
      .then((confirmationResult: auth.ConfirmationResult) => {
        authCredentials.verificationId = confirmationResult.verificationId;
        this.submit.emit({
          credentials: this.credentials, type: this.type
        });
        this.type = 'phone-confirm';
        this.submitButtonText = 'Confirm code';
        this.title = 'Phone number confirmation';
        this.formConfigs = [
          CONFIRM_CODE_FORM_CONFIG
        ];
      })
      .catch((err: FirebaseError) => {
        this.formError.emit(err);
      });
  }

  private handleConfirmationCode(): void {
    this.authCredentials = new PhoneCredentials(
      this.authForm.get('confirmCode').value,
      (<PhoneCredentials>this.authCredentials).phoneNumber,
      null,
      (<PhoneCredentials>this.authCredentials).verificationId
    );
  }

  private handleCredentialChange(): void {
    this.authCredentials = this.credentials;
    Object.keys(this.credentials).forEach((key: string) => {
      const config: DynamicFormInputConfig = this.formConfigs.find((c: DynamicFormInputConfig) => c.formControlName === key);

      if (config) {
        config.value = this.credentials[key];
      }
    });
  }

  private handleEmailSubmit(): void {
    const email: AbstractControl = this.authForm.get('email');
    const password: AbstractControl = this.authForm.get('password');
    const name: AbstractControl = this.authForm.get('username');
    this.authCredentials = new Credentials(email.value.trim(), password ? password.value.trim() : '', name ? name.value.trim() : '');
  }

  private handlePhoneVerification(): void {
    this.authCredentials = new PhoneCredentials('', this.authForm.get('phoneNumber').value, this.recaptchaVerifier);

    this.confirmPhone(this.authCredentials);
  }

  private onRecaptachInit(verifier: auth.ApplicationVerifier): void {
    this.recaptchaVerifier = verifier;
  }

  private onRecaptachVerified(isVerified: boolean): void {
    this.reCaptchaVerified = isVerified;
  }

  private passwordConfirmValidation(control: AbstractControl): { noMatch: boolean } {
    if (this.authForm) {
      const passwordControl: AbstractControl = this.authForm.get('password');

      return passwordControl && passwordControl.value === control.value ? null : { noMatch: true };
    }

    return { noMatch: true };
  }

  private setupForm(): void {
    switch (this.type) {
      case 'registration':
        this.title = 'Register';
        this.submitButtonText = 'Sign up';
        PASSWORD_CONFIRM_FORM_CONFIG.validations[1].func = this.passwordConfirmValidation.bind(this);

        this.formConfigs = [
          EMAIL_FORM_CONFIG,
          USERNAME_FORM_CONFIG,
          PASSWORD_FORM_CONFIG,
          PASSWORD_CONFIRM_FORM_CONFIG
        ];
        break;

      case 'login':
        this.title = 'Login';
        this.submitButtonText = 'Sign in';
        this.formConfigs = [
          EMAIL_FORM_CONFIG,
          PASSWORD_FORM_CONFIG
        ];
        break;

      case 'password-reset':
        this.submitButtonText = 'Send request';
        this.title = 'Reset password';
        this.formConfigs = [
          EMAIL_FORM_CONFIG
        ];
        break;

      case 'phone-number':
        this.title = 'Phone number verification';
        this.submitButtonText = 'Send verification code';
        PHONE_FORM_CONFIG.onrReCaptchaVerified = this.onRecaptachVerified.bind(this);
        PHONE_FORM_CONFIG.onrReCaptchaInit = this.onRecaptachInit.bind(this);
        this.formConfigs = [
          PHONE_FORM_CONFIG
        ];
        break;

      default:
        break;
    }
  }
}
