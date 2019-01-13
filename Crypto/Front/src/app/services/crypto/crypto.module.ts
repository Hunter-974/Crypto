import { NgModule, SkipSelf, Optional, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from './crypto.service';
import { EncryptPipe } from 'src/app/pipes/encrypt/encrypt.pipe';
import { DecryptPipe } from 'src/app/pipes/decrypt/decrypt.pipe';
import { PipesModule } from 'src/app/pipes/pipes/pipes.module';
declare var global;

@NgModule({
  imports: [
    CommonModule,
    PipesModule
  ],
  providers: [CryptoService],
})
export class CryptoModule {
  constructor(
    cryptoService: CryptoService,
    @Optional() @SkipSelf() parentModule: CryptoModule) {
    if (parentModule) {
      throw new Error('CryptoModule is already loaded. Import it in the AppModule only');
    }
    CryptoServiceInstance = cryptoService;
  }

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CryptoModule,
      providers: []
    }
  }
}

export let CryptoServiceInstance: CryptoService;

export let encrypt = value => {
  return CryptoServiceInstance.encrypt(value);
}

export let decrypt = value => {
  return CryptoServiceInstance.decrypt(value);
}

export let hash = value => {
  return CryptoServiceInstance.hash(value);
}


const _global = (window || global) as any;
_global.encrypt = encrypt;
_global.decrypt = decrypt;
