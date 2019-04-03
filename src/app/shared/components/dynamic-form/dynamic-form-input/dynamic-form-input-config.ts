import { auth } from 'firebase/app';
import { DynamicFormConfig } from '../models';

export interface DynamicFormInputConfig extends DynamicFormConfig {
  inputType?: string;
  onrReCaptchaInit?: (verifier: auth.ApplicationVerifier) => void;
  onrReCaptchaVerified?: (isVerified: boolean) => void;
  value?: string | number;
}
