import { FoodsModule } from './foods.module';

describe('FoodsModule', () => {
  let foodsModule: FoodsModule;

  beforeEach(() => {
    foodsModule = new FoodsModule();
  });

  it('should create an instance', () => {
    expect(foodsModule).toBeTruthy();
  });
});
