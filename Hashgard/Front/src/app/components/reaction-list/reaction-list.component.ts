import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base-component';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { ReactionType } from 'src/app/models/reaction-type';
import { Article } from 'src/app/models/article';
import { Comment } from 'src/app/models/comment';
import { ReactionHub } from 'src/app/services/reaction/reaction-hub';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-reaction-list',
  templateUrl: './reaction-list.component.html',
  styleUrls: ['./reaction-list.component.css']
})
export class ReactionListComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() article: Article;
  @Input() comment: Comment;
  @Input() isParentDecrypted: boolean;

  model: any;
  isCreating: boolean;
  error: string;

  //reactionHub: ReactionHub;

  constructor(
    private reactionService: ReactionService,
    logger: LoggerService) {
    super(logger);
  }

  ngOnInit() {
    if (!this.article && !this.comment
      || this.article && this.comment) {
      throw Error("Set article or comment");
    }

    if (this.article) {
      this.model = this.article;
    } else {
      this.model = this.comment;
    }

    //this.startHub();
  }

  ngOnDestroy(): void {
    //this.reactionHub.stop();
  }

  /*
  startHub() {
    var objectType = this.article ? "article" : "comment";

    this.reactionHub = new ReactionHub(objectType, this.model.id);
    this.reactionHub.changed.subscribe(reactionType => this.changed(reactionType));
    this.reactionHub.start().subscribe(
      () => { }, 
      err => this.error = err
    );
  }
  */

  add(reactionType: ReactionType) {
    this.error = null;

    this.reactionService.add(reactionType.id).subscribe(
      result => {
        if (result) {
          reactionType.reactionUserIds = result.reactionUserIds;
          reactionType.reactionCount = result.reactionCount;
        }
      },
      error => this.logger.error(error)
    );
  }

  remove(reactionType: ReactionType) {
    this.error = null;

    this.reactionService.remove(reactionType.id).subscribe(
      result => {
        if (result) {
          reactionType.reactionUserIds = result.reactionUserIds;
          reactionType.reactionCount = result.reactionCount;
        }
      },
      error => this.logger.error(error)
    );
  }

  startCreate() {
    this.isCreating = true;
  }

  cancelCreate() {
    this.isCreating = false;
  }

  create(name: string) {
    this.error = null;
    this.isCreating = false;

    var subscriber = this.article
      ? this.reactionService.createForArticle(this.article.id, name)
      : this.reactionService.createForComment(this.comment.id, name);

    subscriber.subscribe(
      result => this.addOrUpdate(result),
      error => this.logger.error(error)
    );
  }

  changed(reactionType: ReactionType) {
    if ((this.article && reactionType.articleId == this.article.id 
      || this.comment && reactionType.commentId == this.comment.id)) {
      this.addOrUpdate(reactionType);
    }
  }

  addOrUpdate(reactionType: ReactionType) {
    let existingReactionType = this.model.reactionTypes.find(rt => rt.id == reactionType.id);
    if (existingReactionType) {
      existingReactionType.reactionCount = reactionType.reactionCount;
      existingReactionType.reactionUserIds = reactionType.reactionUserIds;
    } else {
      this.model.reactionTypes.push(reactionType);
    }
  }
}
