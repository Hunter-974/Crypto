import { AES, enc, SHA256 } from 'crypto-js'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { InjectionToken } from '@angular/core';
import { StaticInjector } from '@angular/core/src/di/injector';

export class CryptoService {

  private static key: string;
  private static _encryptedTemplate: SafeHtml;

  public static get encryptedTemplate(): SafeHtml {
    if (!CryptoService._encryptedTemplate) {
      CryptoService._encryptedTemplate = CryptoService.createEncryptedTemplate();
    }
    return this._encryptedTemplate;
  }

  public static setKey(key: string) {
    CryptoService.key = key;
  }

  public static hasKey(): boolean {
    if (CryptoService.key && CryptoService.key.length) {
      return true;
    }
    return false;
  }

  private static checkAes() {
    if (!AES) {
      throw Error("Failed to encrypt data.");
    }
    if (!CryptoService.key || !CryptoService.key.length) {
      throw Error("Encryption key not defined.")
    }
  }

  private static checkSha() {
    if (!SHA256) {
      throw Error("Failed to encrypt data.");
    }
  }

  public static encrypt(data: string): string {
    CryptoService.checkAes();
    return AES.encrypt(data, CryptoService.key).toString();
  }

  public static decrypt(data: string): string {
    CryptoService.checkAes();
    return AES.decrypt(data, CryptoService.key).toString(enc.Utf8);
  }

  public static hash(data: string): string {
    CryptoService.checkSha();
    return SHA256(data).toString();
  }

  private static createEncryptedTemplate(): SafeHtml {
    var injector = new StaticInjector([]);
    var sanitizer = injector.get<DomSanitizer>(new InjectionToken("sanitizer"));
    var html = sanitizer.bypassSecurityTrustHtml(
      "<span class=\"bg-dark px-1 my-2\" style=\"font-family: 'Lucida Console'; color: #00FF00; border-radius: 5px \">Encrypted text</span>"
    );
    return html;
   }
}
