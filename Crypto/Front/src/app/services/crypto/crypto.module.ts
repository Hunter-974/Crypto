import { NgModule, SkipSelf, Optional, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from './crypto.service';
import { PipesModule } from 'src/app/pipes/pipes/pipes.module';
import { BaseAuthService } from '../base-auth-service';
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

export let auth = {
  get isLoggedIn(): boolean {
    return BaseAuthService.userId != undefined && BaseAuthService.userId != null;
  },

  get userId(): number {
    return BaseAuthService.userId;
  },

  isOwner(model: any): boolean {
    return model
      && model.user
      && model.user.id
      && model.user.id == BaseAuthService.userId;
  }
};

const _global = (window || global) as any;
_global.encrypt = encrypt;
_global.decrypt = decrypt;
_global.auth = auth;
