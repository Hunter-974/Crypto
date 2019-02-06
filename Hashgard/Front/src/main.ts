import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from 'src/environments/environment';

if (environment.settings.production) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.log(err));