import { Pipe, PipeTransform } from '@angular/core';
import { CryptoService } from '../../services/crypto/crypto.service';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'decrypt',
  pure: false
})
export class DecryptPipe implements PipeTransform {

  constructor(
    private cryptoService: CryptoService,
    private sanitizer: DomSanitizer) { }

  transform(value: any, args?: any): any {
    let decrypted =
      this.sanitizer.bypassSecurityTrustHtml(
        "<span class=\"bg-dark p-1\" style=\"font-family: 'Lucida Console'; color: #00FF00; border-radius: 5px \">Encrypted text</span>"
      );
    try {
      decrypted = this.cryptoService.decrypt(value);
    } catch (ex) {
      window.console.log(ex.message);
    }
    return decrypted;
  }

}
