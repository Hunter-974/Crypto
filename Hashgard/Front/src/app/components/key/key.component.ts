import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';
import { CryptoService } from 'src/app/services/crypto/crypto.service';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css']
})
export class KeyComponent extends BaseComponent implements OnInit {

  edit: boolean = true;
  key: string;
  error: string;

  constructor(logger: LoggerService) {
    super(logger);
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
      this.logger.error(ex)
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
      this.logger.error(Error("Please provide a key."))
    }

    this.key = null;
    this.edit = false;
  }
}
