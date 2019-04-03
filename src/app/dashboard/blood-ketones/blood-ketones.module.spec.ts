import { BloodKetonesModule } from './blood-ketones.module';

describe('BloodKetonesModule', () => {
  let bloodKetonesModule: BloodKetonesModule;

  beforeEach(() => {
    bloodKetonesModule = new BloodKetonesModule();
  });

  it('should create an instance', () => {
    expect(bloodKetonesModule).toBeTruthy();
  });
});
