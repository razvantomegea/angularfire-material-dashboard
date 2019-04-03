import { BloodPressureModule } from './blood-pressure.module';

describe('BloodPressureModule', () => {
  let bloodPressureModule: BloodPressureModule;

  beforeEach(() => {
    bloodPressureModule = new BloodPressureModule();
  });

  it('should create an instance', () => {
    expect(bloodPressureModule).toBeTruthy();
  });
});
