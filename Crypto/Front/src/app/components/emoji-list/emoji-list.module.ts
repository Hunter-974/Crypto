import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiListComponent } from './emoji-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [EmojiListComponent],
  exports: [EmojiListComponent]
})
export class EmojiListModule { }
