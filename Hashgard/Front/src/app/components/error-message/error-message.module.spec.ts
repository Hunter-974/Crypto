import { ErrorMessageModule } from './error-message.module';

describe('ErrorMessageModule', () => {
  let errorMessageModule: ErrorMessageModule;

  beforeEach(() => {
    errorMessageModule = new ErrorMessageModule();
  });

  it('should create an instance', () => {
    expect(errorMessageModule).toBeTruthy();
  });
});
