export class FormErrorMessage {
  constructor(public errorName: string, public errorValidation: string, public errorMessage: string) {
  }
}

export const REQUIRED_EMAIL: FormErrorMessage = new FormErrorMessage('email', 'required', 'Email is required');
export const INVALID_EMAIL: FormErrorMessage = new FormErrorMessage('email', 'email', 'Email is invalid');
export const REQUIRED_USERNAME: FormErrorMessage = new FormErrorMessage('username', 'required', 'Username is required');
export const INVALID_USERNAME: FormErrorMessage = new FormErrorMessage('username', 'pattern', 'Username is invalid');
export const REQUIRED_PASSWORD: FormErrorMessage = new FormErrorMessage('password', 'required', 'Password is required');
export const SHORT_PASSWORD: FormErrorMessage = new FormErrorMessage(
  'password',
  'minlength',
  'Password should contain more than 8 characters.'
);
export const REQUIRED_PASSWORD_CONFIRMATION: FormErrorMessage = new FormErrorMessage(
  'passwordConfirm',
  'required',
  'Password confirmation is' +
  ' required'
);
export const PASSWORD_NO_MATCH: FormErrorMessage = new FormErrorMessage('passwordConfirm', 'noMatch', `Passwords don't match`);
export const REQUIRED_PHONE_NUMBER: FormErrorMessage = new FormErrorMessage('phoneNumber', 'required', 'Phone number is required');
export const INVALID_PHONE_NUMBER: FormErrorMessage = new FormErrorMessage('phoneNumber', 'isInvalid', 'Phone number is invalid');
export const REQUIRED_CODE: FormErrorMessage = new FormErrorMessage('password', 'required', 'Code is required');
export const SHORT_CODE: FormErrorMessage = new FormErrorMessage(
  'confirmCode',
  'minlength',
  'Code should contain 6 characters.'
);
export const LONG_CODE: FormErrorMessage = new FormErrorMessage(
  'confirmCode',
  'maxlength',
  'Code should contain 6 characters.'
);

export class FormValidationErrors {
  constructor(public errorMessages: FormErrorMessage[]) {
  }
}
