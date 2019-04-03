import { StoreModule } from './store.module';

describe('StoreModule', () => {
  let storeModule: StoreModule;

  beforeEach(() => {
    storeModule = new StoreModule();
  });

  it('should create an instance', () => {
    expect(storeModule).toBeTruthy();
  });
});
