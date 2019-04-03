import { MovementModule } from './movement.module';

describe('MovementModule', () => {
  let movementModule: MovementModule;

  beforeEach(() => {
    movementModule = new MovementModule();
  });

  it('should create an instance', () => {
    expect(movementModule).toBeTruthy();
  });
});
