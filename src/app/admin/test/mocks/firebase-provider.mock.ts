import { auth } from 'firebase/app';

export class FirebaseProviderMock implements auth.AuthProvider {
  constructor(public providerId: string) {
  }
}
