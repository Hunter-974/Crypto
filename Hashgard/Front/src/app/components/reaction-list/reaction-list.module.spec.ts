import { ReactionListModule } from './reaction-list.module';

describe('ReactionListModule', () => {
  let reactionListModule: ReactionListModule;

  beforeEach(() => {
    reactionListModule = new ReactionListModule();
  });

  it('should create an instance', () => {
    expect(reactionListModule).toBeTruthy();
  });
});
