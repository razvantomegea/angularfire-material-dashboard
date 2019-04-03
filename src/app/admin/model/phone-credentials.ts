import { auth } from 'firebase/app';

export class PhoneCredentials {
  constructor(
    public code: string,
    public phoneNumber: string,
    public verifier: auth.ApplicationVerifier,
    public verificationId?: string
  ) {
  }
}
