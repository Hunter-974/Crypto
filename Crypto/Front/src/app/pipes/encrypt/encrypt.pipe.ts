import { Pipe, PipeTransform } from '@angular/core';
import { CryptoService } from 'src/app/services/crypto/crypto.service';

@Pipe({
  name: 'encrypt',
  pure: false
})
export class EncryptPipe implements PipeTransform {

  constructor(private cryptoService: CryptoService) { }

  transform(value: any, args?: any): any {
    return this.cryptoService.encrypt(value);
  }

}
