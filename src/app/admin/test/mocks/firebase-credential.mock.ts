import { auth, UserInfo } from 'firebase/app';
import { FirebaseApplicationVerifierMock } from './firebase-application-verifier.mock';

export class FirebaseAuthCredentialMock implements auth.AuthCredential {
  constructor(public providerId: string, public signInMethod: string) {
  }
}

export class FirebaseUserMetadataMock implements auth.UserMetadata {
  constructor(public creationTime?: string, public lastSignInTime?: string) {
  }
}

export class FirebaseUserMock {
  public emailVerified: boolean;
  public metadata: FirebaseUserMetadataMock;
  public phoneNumber: string | null = '';
  public providerData: (UserInfo | null)[];

  public delete(): Promise<any> {
    return Promise.resolve();
  }

  public linkAndRetrieveDataWithCredential(credential: FirebaseAuthCredentialMock): Promise<any> {
    return Promise.resolve();
  }

  public linkWithCredential(credential: FirebaseAuthCredentialMock): Promise<any> {
    return Promise.resolve();
  }

  public linkWithPhoneNumber(phoneNumber: string, applicationVerifier: FirebaseApplicationVerifierMock): Promise<any> {
    return Promise.resolve();
  }

  public linkWithPopup(provider: FirebaseAuthCredentialMock): Promise<any> {
    return Promise.resolve(new FirebaseAuthCredentialMock(provider.providerId, provider.providerId));
  }

  public reload(): Promise<any> {
    return Promise.resolve();
  }

  public sendEmailVerification(): Promise<any> {
    return Promise.resolve();
  }

  public unlink(providerId: string): Promise<any> {
    return Promise.resolve();
  }

  public updateEmail(newEmail: string): Promise<any> {
    return Promise.resolve();
  }

  public updatePassword(newPassword: string): Promise<any> {
    return Promise.resolve();
  }

  public updatePhoneNumber(phoneCredential: FirebaseAuthCredentialMock): Promise<any> {
    return Promise.resolve();
  }

  public updateProfile(profile: UserInfo): Promise<any> {
    return Promise.resolve();
  }
}

export class FirebaseUserCredentialMock {
  public user: FirebaseUserMock = new FirebaseUserMock();

  constructor(credential: FirebaseAuthCredentialMock) {
  }
}
