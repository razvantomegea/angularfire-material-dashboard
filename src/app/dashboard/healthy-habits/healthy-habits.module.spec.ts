import { GuideModule } from './healthy-habits.module';

describe('HealthyHabitsModule', () => {
  let guideModule: GuideModule;

  beforeEach(() => {
    guideModule = new GuideModule();
  });

  it('should create an instance', () => {
    expect(guideModule).toBeTruthy();
  });
});
