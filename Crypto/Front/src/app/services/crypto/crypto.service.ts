import { Injectable, SkipSelf, Optional } from '@angular/core';
import { AES, enc, SHA256 } from 'crypto-js'

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  private key: string;

  public setKey(key: string) {
    this.key = key;
  }

  public encrypt(data: string): string {
    return AES.encrypt(data, this.key).toString();
  }

  public decrypt(data: string): string {
    return AES.decrypt(data, this.key).toString(enc.Utf8);
  }

  public hash(data: string): string {
    return SHA256(data).toString();
  }
}
