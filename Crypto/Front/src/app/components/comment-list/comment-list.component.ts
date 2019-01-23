import { OnInit, Input, Component } from '@angular/core';
import { CommentService } from 'src/app/services/comment/comment.service';
import { Page } from 'src/app/models/page';
import { Comment } from 'src/app/models/comment';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  @Input() articleId: number;

  comments: Page<Comment>;

  newCommentText: string;
  error: string;
  isWriting: boolean;

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.comments = new Page<Comment>();
    this.getForArticle(10, 5);
  }

  getForArticle(count: number, childrenCount: number) {
    this.commentService.getForArticle(this.articleId, this.comments.index, count).subscribe(
      result => {
        for (let comment of result.items) {
          this.getForComment(comment, childrenCount);
        }
        this.comments.addPageBefore(result)
      },
      error => this.error = error
    );
  }

  getForComment(comment: Comment, count: number) {
    if (comment.children == null) {
      comment.children = new Page<Comment>();
    }
    this.commentService.getForComment(comment.id, comment.children.index, count).subscribe(
      result => comment.children.addPageBefore(result),
      error => comment.error = error
    );
  }

  newComment() {
    this.commentService.createForArticle(this.articleId, this.newCommentText)
      .subscribe(
        result => {
          this.comments.addItemAfter(result);
          this.newCommentText = null;
        },
        error => { }
      );
  }

  newSubComment(parentComment: Comment) {
    this.commentService.createForComment(parentComment.id, parentComment.newCommentText)
      .subscribe(
        result => {
          parentComment.children.addItemAfter(result);
          parentComment.newCommentText = null;
        },
        error => { }
      );
  }
}
