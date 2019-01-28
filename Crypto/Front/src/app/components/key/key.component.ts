import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';
import { CryptoService } from 'src/app/services/crypto/crypto.service';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css']
})
export class KeyComponent extends BaseComponent implements OnInit {

  edit: boolean = true;
  key: string;
  error: string;

  constructor() {
    super();
   }

  ngOnInit() {
    this.edit = !this.hasKey;
  }

  change() {
    this.edit = !this.edit;
  }

  submit() {
    this.error = null;
    try {
      if (!this.key || !this.key.length) {
        throw Error("Please provide a key.");
      }
      CryptoService.setKey(this.key);
      this.key = null;
      this.edit = false;
    } catch (ex) {
      this.error = ex.toString();
    }
  }

  clear() {
    CryptoService.setKey(null);
    this.key = null;
    this.edit = false;
  }

  cancel() {
    this.error = null;
    if (!this.hasKey) {
      this.error = Error("Please provide a key.").toString();
    }

    this.key = null;
    this.edit = false;
  }
}
