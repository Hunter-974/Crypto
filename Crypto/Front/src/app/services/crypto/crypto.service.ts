import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js'

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  encrypt(data: string, key: string): string {
    return AES.encrypt(data, key).toString();
  }

  decrypt(data: string, key: string): string {
    return AES.decrypt(data, key).toString(enc.Utf8);
  }
}
