import { EmojiListModule } from './emoji-list.module';

describe('EmojiListModule', () => {
  let emojiListModule: EmojiListModule;

  beforeEach(() => {
    emojiListModule = new EmojiListModule();
  });

  it('should create an instance', () => {
    expect(emojiListModule).toBeTruthy();
  });
});
