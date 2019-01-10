import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from 'src/environments/environment';
import { environmentLoader } from 'src/environments/environmentLoader';
environmentLoader.then(function (env) {
    environment.settings = env.settings;
    if (environment.settings.production) {
        enableProdMode();
    }
    platformBrowserDynamic().bootstrapModule(AppModule).catch(function (err) { return console.log(err); });
});
//# sourceMappingURL=main.js.map