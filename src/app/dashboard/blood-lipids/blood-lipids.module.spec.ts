import { BloodLipidsModule } from './blood-lipids.module';

describe('BloodLipidsModule', () => {
  let bloodLipidsModule: BloodLipidsModule;

  beforeEach(() => {
    bloodLipidsModule = new BloodLipidsModule();
  });

  it('should create an instance', () => {
    expect(bloodLipidsModule).toBeTruthy();
  });
});
