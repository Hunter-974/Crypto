import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListComponent } from './article-list.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes/pipes.module';
import { ErrorMessageModule } from '../error-message/error-message.module';
import { PagerModule } from '../pager/pager.module';
import { AuthorDateModule } from '../author-date/author-date.module';
import { ReactionListModule } from '../reaction-list/reaction-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    ErrorMessageModule,
    PagerModule,
    AuthorDateModule,
    ReactionListModule
  ],
  declarations: [ArticleListComponent],
  exports: [ArticleListComponent]
})
export class ArticleListModule { }
