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

  public hasKey(): boolean {
    if (this.key && this.key.length) {
      return true;
    }
    return false;
  }

  private checkAes() {
    if (!AES) {
      throw Error("Failed to encrypt data.");
    }
    if (!this.key || !this.key.length) {
      throw Error("Encryption key not defined.")
    }
  }

  private checkSha() {
    if (!SHA256) {
      throw Error("Failed to encrypt data.");
    }
  }

  public encrypt(data: string): string {
    this.checkAes();
    return AES.encrypt(data, this.key).toString();
  }

  public decrypt(data: string): string {
    this.checkAes();
    return AES.decrypt(data, this.key).toString(enc.Utf8);
  }

  public hash(data: string): string {
    this.checkSha();
    return SHA256(data).toString();
  }
}
