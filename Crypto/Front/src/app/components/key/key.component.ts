import { Component, OnInit } from '@angular/core';
import { CryptoService } from 'src/app/services/crypto/crypto.service';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css']
})
export class KeyComponent implements OnInit {

  hasKey = false;
  edit: boolean = true;
  key: string;
  error: string;

  constructor(private cryptoService: CryptoService) { }

  ngOnInit() {
    this.hasKey = this.cryptoService.hasKey();
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
      this.cryptoService.setKey(this.key);
      this.hasKey = true;
      this.key = null;
      this.edit = false;
    } catch (ex) {
      this.error = ex.toString();
    }
  }

  clear() {
    this.cryptoService.setKey(null);
    this.key = null;
    this.hasKey = false;
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
