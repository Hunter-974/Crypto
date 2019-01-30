import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './comment.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes/pipes.module';
import { AuthorDateModule } from '../author-date/author-date.module';
import { ErrorMessageModule } from '../error-message/error-message.module';
import { ReactionListModule } from '../reaction-list/reaction-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    AuthorDateModule,
    ErrorMessageModule,
    ReactionListModule
  ],
  declarations: [CommentComponent],
  exports: [CommentComponent]
})
export class CommentModule { }
