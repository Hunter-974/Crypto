import { CategoryListModule } from './category-list.module';

describe('CategoryListModule', () => {
  let categoryListModule: CategoryListModule;

  beforeEach(() => {
    categoryListModule = new CategoryListModule();
  });

  it('should create an instance', () => {
    expect(categoryListModule).toBeTruthy();
  });
});
