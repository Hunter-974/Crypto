import { Component, OnInit } from '@angular/core';
import { CryptoService } from 'src/app/services/crypto/crypto.service';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css']
})
export class KeyComponent implements OnInit {

  showKey: boolean = false;
  edit: boolean = true;
  key: string;

  constructor(private cryptoService: CryptoService) { }

  ngOnInit() {
  }

  toggle() {
    this.edit = !this.edit;
  }

  show() {
    this.showKey = true;
  }

  hide() {
    this.showKey = false;
  }

  submit() {
    this.cryptoService.setKey(this.key);
    this.key = null;
    this.edit = false;
  }
}
