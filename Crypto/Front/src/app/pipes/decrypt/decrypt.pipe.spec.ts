import { DecryptPipe } from './decrypt.pipe';

describe('DecryptPipe', () => {
  it('create an instance', () => {
    const pipe = new DecryptPipe(null);
    expect(pipe).toBeTruthy();
  });
});
