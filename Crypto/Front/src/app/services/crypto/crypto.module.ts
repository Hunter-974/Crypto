import { NgModule, SkipSelf, Optional, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from './crypto.service';
import { InjectorInstance } from 'src/app/app.module';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [CryptoService]
})
export class CryptoModule {
  constructor(
    private cryptoService: CryptoService,
    @Optional() @SkipSelf() parentModule: CryptoModule) {
    if (parentModule) {
      throw new Error('CryptoModule is already loaded. Import it in the AppModule only');
    }
  }

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CryptoModule,
      providers: []
    }
  }
}

export let encrypt = value => {
  let cryptoService = InjectorInstance.get(CryptoService);
  return cryptoService.encrypt(value);
}

export let decrypt = value => {
  let cryptoService = InjectorInstance.get(CryptoService);
  return cryptoService.decrypt(value);
}

export let hash = value => {
  let cryptoService = InjectorInstance.get(CryptoService);
  return cryptoService.hash(value);
}

const _global = (window || global) as any;
_global.encrypt = encrypt;
_global.decrypt = decrypt;
