import { Component, OnInit, Input } from '@angular/core';
import * as emojione from 'emojione';

@Component({
  selector: 'app-emoji',
  templateUrl: './emoji.component.html',
  styleUrls: ['./emoji.component.css']
})
export class EmojiComponent implements OnInit {

  @Input() name: string;

  html: string;

  ngOnInit() {
    this.html = emojione.shortnameToImage(this.name);
  }

}
