import { UserInfo, userMock } from 'app/shared/models';
import { BehaviorSubject } from 'app/shared/utils/rxjs-exports';
import { FirebaseAuthCredentialMock, FirebaseProviderMock, FirebaseUserCredentialMock } from '../mocks';

const fakeAuthState: BehaviorSubject<UserInfo> = new BehaviorSubject(null);

const fakeCreateUserWithEmailAndPasswordHandler = (email: string, password: string): Promise<FirebaseUserCredentialMock> => {
  fakeAuthState.next(userMock);
  return Promise.resolve(new FirebaseUserCredentialMock(new FirebaseAuthCredentialMock('password', 'password')));
};

const fakeSignInWithPopupHandler = (provider: FirebaseProviderMock): Promise<FirebaseUserCredentialMock> => {
  fakeAuthState.next(userMock);
  return Promise.resolve(new FirebaseUserCredentialMock(new FirebaseAuthCredentialMock(provider.providerId, provider.providerId)));
};

const fakeSignOutHandler = (): Promise<void> => {
  fakeAuthState.next(null);
  return Promise.resolve();
};

export interface FirebaseAuthStub {
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<FirebaseUserCredentialMock>;
  signInWithPopup: (provider: FirebaseProviderMock) => Promise<FirebaseUserCredentialMock>;
  signOut: () => Promise<void>;
}

export interface AngularFireAuthStub {
  auth: FirebaseAuthStub;
  authState: BehaviorSubject<UserInfo>;
}

export const angularFireAuthStub: AngularFireAuthStub = {
  authState: fakeAuthState,
  auth: {
    createUserWithEmailAndPassword: jasmine.createSpy('createUserWithEmailAndPassword')
      .and
      .callFake(fakeCreateUserWithEmailAndPasswordHandler),
    signInWithPopup: jasmine.createSpy('signInWithPopup')
      .and
      .callFake(fakeSignInWithPopupHandler),
    signOut: jasmine.createSpy('signOut').and.callFake(fakeSignOutHandler)
  }
};
