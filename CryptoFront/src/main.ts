import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment, environmentLoader } from './app/environment';

environmentLoader.then(env => {
  environment.settings = env.settings;

  if (environment.settings.production) {
      enableProdMode();
  }

  platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));
});