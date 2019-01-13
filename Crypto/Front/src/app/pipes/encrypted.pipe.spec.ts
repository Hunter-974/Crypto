import { EncryptedPipe } from './encrypted.pipe';

describe('EncryptedPipe', () => {
  it('create an instance', () => {
    const pipe = new EncryptedPipe(null);
    expect(pipe).toBeTruthy();
  });
});
