import { KeyModule } from './key.module';

describe('KeyModule', () => {
  let keyModule: KeyModule;

  beforeEach(() => {
    keyModule = new KeyModule();
  });

  it('should create an instance', () => {
    expect(keyModule).toBeTruthy();
  });
});
