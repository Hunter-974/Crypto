import { OnInit, Input, Component, Output, EventEmitter } from '@angular/core';
import { CommentService } from 'src/app/services/comment/comment.service';
import { Page } from 'src/app/models/page';
import { Comment } from 'src/app/models/comment';
import { BaseComponent } from '../base-component';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent extends BaseComponent implements OnInit {

  @Input() articleId: number;
  @Input() isParentDecrypted: boolean;
  @Output() changed: EventEmitter<Page<Comment>> = new EventEmitter<Page<Comment>>(true);

  comments: Page<Comment>;

  error: string;
  isWriting: boolean;

  constructor(private commentService: CommentService) { 
    super();
  }

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
        this.changed.emit(this.comments);
      },
      error => this.error = error
    );
  }

  getForComment(comment: Comment, count: number) {
    if (comment.children == null) {
      comment.children = new Page<Comment>();
    }
    this.commentService.getForComment(comment.id, comment.children.index, count).subscribe(
      result => {
        comment.children.addPageBefore(result);
        this.changed.emit(this.comments);
      },
      error => comment.error = error
    );
  }

  replying(parent: Comment) {
    parent.isWriting = true;
  }

  createParent() {
    this.isWriting = true;
  }

  parentCreated(parent: Comment) {
    this.comments.addItemAfter(parent);
    this.changed.emit(this.comments);
    this.isWriting = false;
  }

  createParentCanceled() {
    this.isWriting = false;
  }

  parentDeleted(parent: Comment) {
    this.comments.remove(parent);
    this.changed.emit(this.comments);
  }

  createChild(parent: Comment) {
    parent.isWriting = true;
  }

  childCreated(child: Comment, parent: Comment) {
    parent.children.addItemAfter(child);
    this.changed.emit(this.comments);
    parent.isWriting = false;
  }

  createChildCanceled(child: Comment, parent: Comment) {
    parent.isWriting = false;
  }

  childDeleted(child: Comment, parent: Comment) {
    parent.children.remove(child);
    this.changed.emit(this.comments);
  }
  
}
