import { Component, Output, EventEmitter } from '@angular/core';
import * as emojis from "emojione/emoji.json";
import { Page } from 'src/app/models/page';

@Component({
  selector: 'app-emoji-list',
  templateUrl: './emoji-list.component.html',
  styleUrls: ['./emoji-list.component.css']
})
export class EmojiListComponent {

  static _emojiList: string[];

  @Output() emojiClick: EventEmitter<string> = new EventEmitter<string>();
  @Output() canceled: EventEmitter<any> = new EventEmitter<any>();

  getMethod: (i: number, s: number) => Page<any>
    = (i, s) => this._getMethod(i, s);

  emojiClicked(name: string) {
    this.emojiClick.emit(name);
  }

  get emojiNameList() {
    if (!EmojiListComponent._emojiList) {
      EmojiListComponent._emojiList = [];
      for (let key in emojis) {
        let name = emojis[key].shortname;
        EmojiListComponent._emojiList.push(name);
      }
    }
    return EmojiListComponent._emojiList;
  }

  _getMethod(index: number, size: number): Page<any> {
    let items = this.emojiNameList.slice(index * size, (index + 1) * size);
    let page = new Page<any>();
    page.items = items;
    page.index = index;
    page.count = items.length;
    page.totalCount = this.emojiNameList.length;
    return page;
  }

  cancel() {
    this.canceled.emit();
  }
}
