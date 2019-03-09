import { Component, Input, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '../base-component';
import { ReactionType } from 'src/app/models/reaction-type';
import { BaseAuthService } from 'src/app/services/base-auth-service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-reaction',
  templateUrl: './reaction.component.html',
  styleUrls: ['./reaction.component.css']
})
export class ReactionComponent extends BaseComponent {

  @Input() reactionType: ReactionType;
  @Input() isParentDecrypted: boolean;

  @Output() add: EventEmitter<ReactionType> = new EventEmitter<ReactionType>();
  @Output() remove: EventEmitter<ReactionType> = new EventEmitter<ReactionType>();

  isWriting: boolean;

  constructor(logger: LoggerService) {
    super(logger);
  }

  clicked() {
    if (this.hasUser) {
      this.remove.emit(this.reactionType);
    } else {
      this.add.emit(this.reactionType);
    }
  }

  get hasUser(): boolean {
    return BaseAuthService.isLoggedIn
      && this.reactionType.reactionUserIds.indexOf(BaseAuthService.userId) > -1;
  }
}
