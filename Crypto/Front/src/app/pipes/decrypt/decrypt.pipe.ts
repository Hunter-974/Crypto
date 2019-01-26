import { Pipe, PipeTransform } from '@angular/core';
import { CryptoService } from '../../services/crypto/crypto.service';

@Pipe({
  name: 'decrypt',
  pure: false
})
export class DecryptPipe implements PipeTransform {

  constructor() { }

  transform(value: any, args?: any): any {
    let result = CryptoService.encryptedTemplate;
      
    try {
      var decrypted = CryptoService.decrypt(value);
      if (decrypted && decrypted.length) {
        result = decrypted;
      }
    } catch (ex) {
      window.console.log(ex.message);
    }
    return result;
  }

}
