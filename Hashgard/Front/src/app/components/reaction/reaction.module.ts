import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactionComponent } from './reaction.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes/pipes.module';
import { EmojiModule } from '../emoji/emoji.module';
import { EmojiListModule } from '../emoji-list/emoji-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    EmojiModule,
    EmojiListModule
  ],
  declarations: [ReactionComponent],
  exports: [ReactionComponent]
})
export class ReactionModule { }
