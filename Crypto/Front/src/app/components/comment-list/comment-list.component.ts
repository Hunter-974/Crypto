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

  static readonly pageSize: number = 20;

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.comments = new Page<Comment>();
    this.getForArticle();
  }

  getForArticle() {
    this.commentService.getForArticle(this.articleId, this.comments.index, CommentListComponent.pageSize).subscribe(
      result => this.comments.addBefore(result),
      error => { }
    );
  }

  getForComment(comment: Comment) {
    this.commentService.getForComment(comment.id, comment.children.index, CommentListComponent.pageSize).subscribe(
      result => comment.children.addBefore(result),
      error => { }
    );
  }
}
