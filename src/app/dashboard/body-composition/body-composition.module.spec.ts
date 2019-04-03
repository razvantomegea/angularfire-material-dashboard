import { BodyCompositionModule } from './body-composition.module';

describe('BodyCompositionModule', () => {
  let fitnessModule: BodyCompositionModule;

  beforeEach(() => {
    fitnessModule = new BodyCompositionModule();
  });

  it('should create an instance', () => {
    expect(fitnessModule).toBeTruthy();
  });
});
