import { OnInit, Input, Component, EventEmitter, Output } from '@angular/core';
import { Comment } from '../../models/comment';
import { BaseComponent } from '../base-component';
import { CommentService } from 'src/app/services/comment/comment.service';
import { decrypt } from 'src/app/services/crypto/crypto.service';
import { Page } from 'src/app/models/page';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent extends BaseComponent implements OnInit {

  @Input() articleId: number;
  @Input() parentId: number;
  @Input() comment: Comment;
  @Input() isCreating: boolean;
  @Input() isEditing: boolean;
  @Input() isParentDecrypted: boolean;

  @Output() replying: EventEmitter<Comment> = new EventEmitter<Comment>();
  @Output() created: EventEmitter<Comment> = new EventEmitter<Comment>();
  @Output() edited: EventEmitter<Comment> = new EventEmitter<Comment>();
  @Output() deleted: EventEmitter<Comment> = new EventEmitter<Comment>();
  @Output() canceled: EventEmitter<Comment> = new EventEmitter<Comment>();

  newText: string;

  constructor(
    private commentService: CommentService,
    logger: LoggerService) {
    super(logger);
   }

  ngOnInit() {
    if (this.isCreating 
      && (this.parentId && this.articleId 
        || !this.parentId && !this.articleId)) {
      throw Error("Set parentId OR articleId property.");
    }
    if (this.isCreating && !this.comment) {
      this.comment = new Comment();
    }
  }

  reply() {
    this.replying.emit(this.comment);
  }

  create() {
    var createSubscriber = this.articleId 
      ? this.commentService.createForArticle(this.articleId, this.newText)
      : this.commentService.createForComment(this.parentId, this.newText);

    createSubscriber.subscribe(
      result => {
        result.reactionTypes = [];
        result.children = new Page<Comment>();
        this.created.emit(result);
        this.newText = null;
      },
      error => this.logger.error(error)
    );
  }

  startEdit() {
    this.isEditing = true;
    try
    {
      this.newText = decrypt(this.comment.text);
    } catch (ex) {
      this.logger.error(ex)
    }
  }

  edit() {
    this.commentService.edit(this.comment.id, this.newText).subscribe(
      result => {
        result.children = this.comment.children;
        result.reactionTypes = this.comment.reactionTypes;
        this.comment = result;
        this.isEditing = false;
        this.newText = null;
        this.edited.emit(result);
      },
      error => this.logger.error(error)
    );
  }

  delete() {
    if (confirm("Are you sure you want to delete this comment ?")) {
      this.commentService.remove(this.comment.id).subscribe(
        () => this.deleted.emit(this.comment),
        error => this.logger.error(error)
      );
    }
  }

  cancel() {
    this.isEditing = false;
    this.newText = null;
    this.canceled.emit(this.comment);
  }
}
