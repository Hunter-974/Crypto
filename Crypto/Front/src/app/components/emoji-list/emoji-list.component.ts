import { Component, Output, EventEmitter } from '@angular/core';
import * as emojis from "emojione/emoji.json";

@Component({
  selector: 'app-emoji-list',
  templateUrl: './emoji-list.component.html',
  styleUrls: ['./emoji-list.component.css']
})
export class EmojiListComponent {

  @Output() emojiClick: EventEmitter<string> = new EventEmitter<string>();

  clicked(name: string) {
    this.emojiClick.emit(name);
  }

  get emojiList() {
    return emojis;
  }
}
