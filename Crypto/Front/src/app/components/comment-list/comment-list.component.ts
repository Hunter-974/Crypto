import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from 'src/app/services/comment/comment.service';
import { Observable } from 'rxjs';
import { Page } from 'src/app/models/page';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  @Input() articleId: number;

  getMethod: (i: number, s: number) => Observable<Page<Comment>>
    = (i: number, s: number) => this.getForArticle(i, s);

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.getComments();
  }

  getComments() {
      this.getMethod 
  }

  getForArticle(index: number, size: number): Observable<Page<Comment>> {
    return this.commentService.getForArticle(this.articleId, index, size)
  }

  subGetMethod(commentId: number) {
    return (i: number, s: number) => this.commentService.getForComment(commentId, i, s);
  }
}
