import { ArticleListModule } from './article-list.module';

describe('ArticleListModule', () => {
  let articleListModule: ArticleListModule;

  beforeEach(() => {
    articleListModule = new ArticleListModule();
  });

  it('should create an instance', () => {
    expect(articleListModule).toBeTruthy();
  });
});
