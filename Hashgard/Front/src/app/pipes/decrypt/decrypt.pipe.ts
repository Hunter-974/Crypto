import { Pipe, PipeTransform } from '@angular/core';
import { CryptoService } from '../../services/crypto/crypto.service';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'decrypt',
  pure: false
})
export class DecryptPipe implements PipeTransform {

  constructor(private domSanitizer: DomSanitizer) { }

  transform(value: any, args?: any): any {
    let result = this.domSanitizer.bypassSecurityTrustHtml(CryptoService.encryptedTemplate);
    try {
      var decrypted = CryptoService.decrypt(value);
      if (decrypted && decrypted.length) {
        result = decrypted;
      }
    } catch { }
    return result;
  }

}
