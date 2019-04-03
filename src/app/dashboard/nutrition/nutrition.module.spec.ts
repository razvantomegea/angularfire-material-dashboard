import { NutritionModule } from './nutrition.module';

describe('NutritionModule', () => {
  let nutritionModule: NutritionModule;

  beforeEach(() => {
    nutritionModule = new NutritionModule();
  });

  it('should create an instance', () => {
    expect(nutritionModule).toBeTruthy();
  });
});
