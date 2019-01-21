import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from './comment-list.component';
import { CommentModule } from '../comment/comment.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CommentModule,
    FormsModule
  ],
  declarations: [CommentListComponent],
  exports: [CommentListComponent]
})
export class CommentListModule { }
