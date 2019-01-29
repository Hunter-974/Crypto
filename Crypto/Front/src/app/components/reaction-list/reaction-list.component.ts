import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base-component';
import { ReactionService } from 'src/app/services/reaction/reaction.service';

@Component({
  selector: 'app-reaction-list',
  templateUrl: './reaction-list.component.html',
  styleUrls: ['./reaction-list.component.css']
})
export class ReactionListComponent extends BaseComponent implements OnInit {

  @Input() model: any;

  constructor(private reactionService: ReactionService) {
    super();
   }

  ngOnInit() {
  }

}
