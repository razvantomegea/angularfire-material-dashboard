import { FirebaseModule } from './firebase.module';

describe('FirebaseModule', () => {
  let firebaseModule: FirebaseModule;

  beforeEach(() => {
    firebaseModule = new FirebaseModule();
  });

  it('should create an instance', () => {
    expect(firebaseModule).toBeTruthy();
  });
});
