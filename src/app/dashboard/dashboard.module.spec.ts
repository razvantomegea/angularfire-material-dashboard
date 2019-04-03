import { DashboardModule } from './dashboard.module';

describe('DashboardModule', () => {
  let homeModule: DashboardModule;

  beforeEach(() => {
    homeModule = new DashboardModule();
  });

  it('should create an instance', () => {
    expect(homeModule).toBeTruthy();
  });
});
