import { ReactionModule } from './reaction.module';

describe('ReactionModule', () => {
  let reactionModule: ReactionModule;

  beforeEach(() => {
    reactionModule = new ReactionModule();
  });

  it('should create an instance', () => {
    expect(reactionModule).toBeTruthy();
  });
});
