import { auth } from 'firebase/app';

export class FirebaseApplicationVerifierMock implements auth.ApplicationVerifier {
  public type: string;
  public verify(): Promise<any> {
    return Promise.resolve();
  }
}
