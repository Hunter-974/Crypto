import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveViewerComponent } from './live-viewer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LiveViewerComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    TranslateModule
  ],
  exports: [LiveViewerComponent]
})
export class LiveViewerModule { }
