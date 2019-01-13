import { HttpClient, HttpHeaders, HttpHeaderResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { CryptoService } from "./crypto/crypto.service";

export class BaseAuthService {

  protected baseUrl: string;

  constructor(protected http: HttpClient, path: string) {
    this.baseUrl = `${environment.settings.apiBaseUrl}/${path}`;
  }

  protected static token: string;

  protected getOptions(): { headers: HttpHeaders } {
    var headers = new HttpHeaders();
    if (BaseAuthService.token) {
      headers = headers.append("Token", BaseAuthService.token);
    }
    return { headers: headers };
  }
}
