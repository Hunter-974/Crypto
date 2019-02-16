import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveViewerComponent } from './live-viewer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [LiveViewerComponent],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [LiveViewerComponent]
})
export class LiveViewerModule { }
