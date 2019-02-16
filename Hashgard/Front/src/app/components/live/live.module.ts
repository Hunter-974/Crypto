import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveComponent } from './live.component';
import { TranslateModule } from '@ngx-translate/core';
import { LiveViewerModule } from '../live-viewer/live-viewer.module';

@NgModule({
  declarations: [LiveComponent],
  imports: [
    CommonModule,
    LiveViewerModule,
    TranslateModule
  ], exports: [LiveComponent]
})
export class LiveModule { }
