import { NgModule, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentListComponent } from './comment-list.component';
import { CommentModule } from '../comment/comment.module';
import { FormsModule } from '@angular/forms';
import { ErrorMessageModule } from '../error-message/error-message.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    CommentModule,
    FormsModule,
    ErrorMessageModule,
    TranslateModule
  ],
  declarations: [CommentListComponent],
  exports: [CommentListComponent]
})
export class CommentListModule {
}
