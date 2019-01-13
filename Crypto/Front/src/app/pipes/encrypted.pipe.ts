import { Pipe, PipeTransform } from '@angular/core';
import { CryptoService } from '../services/crypto/crypto.service';

@Pipe({
  name: 'encrypted'
})
export class EncryptedPipe implements PipeTransform {

  constructor(private cryptoService: CryptoService) {

  }

  transform(value: any, args?: any): any {
    return this.cryptoService.decrypt(value);
  }

}
