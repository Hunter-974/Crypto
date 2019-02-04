import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base-component';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { ReactionType } from 'src/app/models/reaction-type';
import { Article } from 'src/app/models/article';
import { Comment } from 'src/app/models/comment';
import { ReactionHub } from 'src/app/services/reaction/reaction-hub';
import { BaseAuthService } from 'src/app/services/base-auth-service';

@Component({
  selector: 'app-reaction-list',
  templateUrl: './reaction-list.component.html',
  styleUrls: ['./reaction-list.component.css']
})
export class ReactionListComponent extends BaseComponent implements OnInit {

  @Input() article: Article;
  @Input() comment: Comment;
  @Input() isParentDecrypted: boolean;

  model: any;
  isCreating: boolean;
  error: string;

  reactionHub: ReactionHub = new ReactionHub();

  constructor(private reactionService: ReactionService) {
    super();
    this.reactionHub.changed.subscribe(
      reactionType => this.changed(reactionType));
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

    this.reactionHub.start();
  }

  add(reactionType: ReactionType) {
    this.error = null;

    this.reactionService.add(reactionType.id).subscribe(
      result => {
        if (result) {
          reactionType.reactionUserIds = result.reactionUserIds;
          reactionType.reactionCount = result.reactionCount;
        }
      },
      error => this.error = error.toString()
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
      error => this.error = error.toString()
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
      error => this.error = error.toString()
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
