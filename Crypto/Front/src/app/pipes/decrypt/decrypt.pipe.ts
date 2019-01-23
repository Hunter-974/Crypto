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
    let result =
      this.sanitizer.bypassSecurityTrustHtml(
        "<span class=\"bg-dark px-1 my-2\" style=\"font-family: 'Lucida Console'; color: #00FF00; border-radius: 5px \">Encrypted text</span>"
      );
    try {
      var decrypted = this.cryptoService.decrypt(value);
      if (decrypted && decrypted.length) {
        result = decrypted;
      }
    } catch (ex) {
      window.console.log(ex.message);
    }
    return result;
  }

}
