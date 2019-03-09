import { AuthorDateModule } from './author-date.module';

describe('AuthorDateModule', () => {
  let authorDateModule: AuthorDateModule;

  beforeEach(() => {
    authorDateModule = new AuthorDateModule();
  });

  it('should create an instance', () => {
    expect(authorDateModule).toBeTruthy();
  });
});
