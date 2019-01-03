import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

export class BaseAuthService {

    protected baseUrl: string;

    constructor(protected http: HttpClient, path: string) {
        this.baseUrl = `${environment.settings.apiBaseUrl}/{path}`;
    }

    public token: string;

    protected getOptions(): { headers: HttpHeaders } {
        var headers = new HttpHeaders();
        if (this.token) {
            headers.append("Token", this.token);
        }
        return { headers: headers };
    }
}
