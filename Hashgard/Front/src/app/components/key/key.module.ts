import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyComponent } from './key.component';
import { FormsModule } from '@angular/forms';
import { ErrorMessageModule } from '../error-message/error-message.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ErrorMessageModule
  ],
  declarations: [KeyComponent],
  exports: [KeyComponent]
})
export class KeyModule { }
