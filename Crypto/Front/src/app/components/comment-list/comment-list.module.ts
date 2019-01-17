import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from './comment-list.component';
import { CommentModule } from '../comment/comment.module';
import { PagerModule } from '../pager/pager.module';

@NgModule({
  imports: [
    CommonModule,
    CommentModule,
    PagerModule
  ],
  declarations: [CommentListComponent],
  exports: [CommentListComponent]
})
export class CommentListModule { }
