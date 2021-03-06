import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from './article.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/pipes/pipes/pipes.module';
import { ErrorMessageModule } from '../error-message/error-message.module';
import { CommentListModule } from '../comment-list/comment-list.module';
import { AuthorDateModule } from '../author-date/author-date.module';
import { ReactionListModule } from '../reaction-list/reaction-list.module';
import { RouterModule, Route } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const routes: Route[] = [
  { path: '', component: ArticleComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    ErrorMessageModule,
    CommentListModule,
    AuthorDateModule,
    ReactionListModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ArticleComponent],
  exports: [
    ArticleComponent, 
    RouterModule
  ]
})

export class ArticleModule { }
