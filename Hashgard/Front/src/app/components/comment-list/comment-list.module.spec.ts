import { CommentListModule } from './comment-list.module';

describe('CommentListModule', () => {
  let commentListModule: CommentListModule;

  beforeEach(() => {
    commentListModule = new CommentListModule();
  });

  it('should create an instance', () => {
    expect(commentListModule).toBeTruthy();
  });
});
