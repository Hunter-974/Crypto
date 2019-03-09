import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiListComponent } from './emoji-list.component';
import { EmojiModule } from '../emoji/emoji.module';
import { PagerModule } from '../pager/pager.module';

@NgModule({
  imports: [
    CommonModule,
    EmojiModule,
    PagerModule
  ],
  declarations: [EmojiListComponent],
  exports: [EmojiListComponent]
})
export class EmojiListModule { }
