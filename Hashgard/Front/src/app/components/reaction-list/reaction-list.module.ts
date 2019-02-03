import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactionListComponent } from './reaction-list.component';
import { ReactionModule } from '../reaction/reaction.module';
import { ErrorMessageModule } from '../error-message/error-message.module';
import { EmojiListModule } from '../emoji-list/emoji-list.module';

@NgModule({
  imports: [
    CommonModule,
    ReactionModule,
    ErrorMessageModule,
    EmojiListModule
  ],
  declarations: [ReactionListComponent],
  exports: [ReactionListComponent]
})
export class ReactionListModule { }
