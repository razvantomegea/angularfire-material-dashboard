import { BloodGlucoseModule } from './blood-glucose.module';

describe('BloodGlucoseModule', () => {
  let bloodGlucoseModule: BloodGlucoseModule;

  beforeEach(() => {
    bloodGlucoseModule = new BloodGlucoseModule();
  });

  it('should create an instance', () => {
    expect(bloodGlucoseModule).toBeTruthy();
  });
});
