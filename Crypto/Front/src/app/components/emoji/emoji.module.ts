import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiComponent } from './emoji.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [EmojiComponent],
  exports: [EmojiComponent]
})
export class EmojiModule { }
