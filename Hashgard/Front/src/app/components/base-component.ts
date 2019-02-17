import { BaseAuthService } from "../services/base-auth-service";
import { CryptoService } from "../services/crypto/crypto.service";
import { User } from "../models/user";
import { LoggerService } from "../services/logger/logger.service";

export class BaseComponent {
    
  constructor(protected logger: LoggerService) {

  }
  
  get isLoggedIn(): boolean {
    return BaseAuthService.isLoggedIn;
  };

  get userId(): number {
    return BaseAuthService.userId;
  };

  get user(): User {
    return BaseAuthService.user;
  }

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
