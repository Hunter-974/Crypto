import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base-component';
import { ReactionService } from 'src/app/services/reaction/reaction.service';
import { ReactionType } from 'src/app/models/reaction-type';
import { Article } from 'src/app/models/article';
import { Comment } from 'src/app/models/comment';

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

  constructor(private reactionService: ReactionService) {
    super();
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
  }

  add(reactionType: ReactionType) {
    this.reactionService.add(reactionType.id).subscribe(
      result => {
        reactionType.hasUserReacted = true;
        reactionType.reactionCount++;
      },
      error => this.error = error.toString()
    );
  }

  remove(reactionType: ReactionType) {
    this.reactionService.remove(reactionType.id).subscribe(
      result => {
        reactionType.hasUserReacted = false;
        reactionType.reactionCount--;
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
    var subscriber = this.article
      ? this.reactionService.createForArticle(this.article.id, name)
      : this.reactionService.createForComment(this.comment.id, name);

    subscriber.subscribe(
      result => {
        this.model.reactionTypes.push(result);
        this.isCreating = false;
      },
      error => this.error = error.toString()
    );
  }

}
