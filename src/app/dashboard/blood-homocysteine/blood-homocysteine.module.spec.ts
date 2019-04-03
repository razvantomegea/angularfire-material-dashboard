import { BloodHomocysteineModule } from './blood-homocysteine.module';

describe('BloodHomocysteineModule', () => {
  let bloodHomocysteineModule: BloodHomocysteineModule;

  beforeEach(() => {
    bloodHomocysteineModule = new BloodHomocysteineModule();
  });

  it('should create an instance', () => {
    expect(bloodHomocysteineModule).toBeTruthy();
  });
});
