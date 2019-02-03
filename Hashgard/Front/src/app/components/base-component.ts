import { BaseAuthService } from "../services/base-auth-service";
import { CryptoService } from "../services/crypto/crypto.service";

export class BaseComponent {
    
  get isLoggedIn(): boolean {
    return BaseAuthService.isLoggedIn;
  };

  get userId(): number {
    return BaseAuthService.userId;
  };

  isOwner(model: any): boolean {
    return BaseAuthService.isOwner(model);
  }

  get hasKey(): boolean {
    return CryptoService.hasKey;
  }

  isDecrypted(value: string): boolean {
    var result = false;
    try {
      var decrypted = CryptoService.decrypt(value);
      result = (decrypted && decrypted.length > 0);
    } catch {}
    return result;
  }
}
