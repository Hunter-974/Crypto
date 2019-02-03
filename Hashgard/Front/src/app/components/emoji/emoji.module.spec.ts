import { EmojiModule } from './emoji.module';

describe('EmojiModule', () => {
  let emojiModule: EmojiModule;

  beforeEach(() => {
    emojiModule = new EmojiModule();
  });

  it('should create an instance', () => {
    expect(emojiModule).toBeTruthy();
  });
});
