import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { PhoneCredentials } from 'app/admin/model';
import { AuthService, CONFIRM_CODE_FORM_CONFIG, PHONE_FORM_CONFIG } from 'app/admin/services';
import { NotificationService } from 'app/core/services';
import { DynamicFormService } from 'app/core/services/dynamic-form.service';
import { DynamicFormConfig } from 'app/shared/components/dynamic-form';
import { DialogClosed } from 'app/shared/mixins';
import { auth, FirebaseError } from 'firebase/app';
import 'intl-tel-input';
import 'intl-tel-input/build/js/utils';

interface FormValue {
  confirmCode: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-phone-edit-dialog',
  templateUrl: './phone-edit-dialog.component.html',
  styleUrls: ['./phone-edit-dialog.component.scss']
})
export class PhoneEditDialogComponent extends DialogClosed {
  public formClasses: string[] = ['form-dialog'];
  public formConfigs: DynamicFormConfig[] = [PHONE_FORM_CONFIG];
  public initialFormData: FormValue;
  public isSaving = false;
  public reCaptchaVerified = false;
  public submitButtonText: string;
  public title: string;
  public type: string;
  private credentials: PhoneCredentials;
  private recaptchaVerifier: auth.ApplicationVerifier;

  constructor(
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) private data: string,
    protected dialogRef: MatDialogRef<PhoneEditDialogComponent>,
    private dynamicFormService: DynamicFormService,
    private notificationService: NotificationService,
    protected router: Router
  ) {
    super(dialogRef, router);
    this.setupForm();
    this.initialFormData = this.dynamicFormService.mapConfigToValue(this.formConfigs, data);
  }

  public isPhoneConfirmCode(): boolean {
    return this.type === 'phone-confirm';
  }

  public isPhoneVerify(): boolean {
    return this.type === 'phone-number';
  }

  public onResendCode(): void {
    this.setupForm();
  }

  public onSubmit(value: FormValue): void {
    if (!this.reCaptchaVerified) {
      this.notificationService.showInfo('Please confirm reCaptcha!');
    } else {
      if (this.isPhoneVerify()) {
        this.handlePhoneVerification(value);
      } else if (this.isPhoneConfirmCode()) {
        this.handleConfirmationCode(value);
      }
    }
  }

  private confirmPhone(authCredentials: PhoneCredentials): void {
    this.isSaving = true;
    this.authService.confirmPhone(authCredentials)
      .then((confirmationResult: auth.ConfirmationResult) => {
        this.credentials.verificationId = confirmationResult.verificationId;
        this.type = 'phone-confirm';
        this.title = 'Phone number confirmation';
        this.submitButtonText = 'CONFIRM';
        this.formConfigs = [
          CONFIRM_CODE_FORM_CONFIG
        ];
        this.isSaving = false;
        this.notificationService.showInfo('Please enter the received verification code via SMS.');
      })
      .catch((err: FirebaseError) => {
        this.isSaving = false;
        throw err;
      });
  }

  private handleConfirmationCode(value: FormValue): void {
    this.credentials = new PhoneCredentials(
      value.confirmCode,
      this.credentials.phoneNumber,
      null,
      this.credentials.verificationId
    );

    this.dialogRef.close(this.credentials);
  }

  private handlePhoneVerification(value: FormValue): void {
    this.credentials = new PhoneCredentials('', value.phoneNumber, this.recaptchaVerifier);

    this.confirmPhone(this.credentials);
  }

  private onRecaptachInit(verifier: auth.ApplicationVerifier): void {
    this.recaptchaVerifier = verifier;
  }

  private onRecaptachVerified(isVerified: boolean): void {
    this.reCaptchaVerified = isVerified;
  }

  private setupForm(): void {
    this.type = 'phone-number';
    this.title = 'Phone number verification';
    this.submitButtonText = 'Send verification code';
    PHONE_FORM_CONFIG.onrReCaptchaVerified = this.onRecaptachVerified.bind(this);
    PHONE_FORM_CONFIG.onrReCaptchaInit = this.onRecaptachInit.bind(this);
    this.formConfigs = [
      PHONE_FORM_CONFIG
    ];
  }

}
