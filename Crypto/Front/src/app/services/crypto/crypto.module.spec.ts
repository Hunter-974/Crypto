import { CryptoModule } from './crypto.module';

describe('CryptoModule', () => {
  let cryptoModule: CryptoModule;

  beforeEach(() => {
    cryptoModule = new CryptoModule(null, null);
  });

  it('should create an instance', () => {
    expect(cryptoModule).toBeTruthy();
  });
});
