import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as fr from './i18n/fr.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Hashgard';

  constructor(translateService: TranslateService) {
    translateService.defaultLang = "fr";
    translateService.use("fr");
    translateService.setTranslation("fr", fr)
  }
}
