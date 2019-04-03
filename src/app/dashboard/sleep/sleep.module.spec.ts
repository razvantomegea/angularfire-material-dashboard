import { SleepModule } from './sleep.module';

describe('SleepModule', () => {
  let sleepModule: SleepModule;

  beforeEach(() => {
    sleepModule = new SleepModule();
  });

  it('should create an instance', () => {
    expect(sleepModule).toBeTruthy();
  });
});
