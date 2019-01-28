import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from './article.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes/pipes.module';
import { ErrorMessageModule } from '../error-message/error-message.module';
import { CommentListModule } from '../comment-list/comment-list.module';
import { AuthorDateModule } from '../author-date/author-date.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    ErrorMessageModule,
    CommentListModule,
    AuthorDateModule
  ],
  declarations: [ArticleComponent],
  exports: [ArticleComponent]
})
export class ArticleModule { }
