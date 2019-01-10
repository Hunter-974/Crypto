import { HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
var BaseAuthService = /** @class */ (function () {
    function BaseAuthService(http, path) {
        this.http = http;
        this.baseUrl = environment.settings.apiBaseUrl + "/" + path;
    }
    BaseAuthService.prototype.getOptions = function () {
        var headers = new HttpHeaders();
        if (this.token) {
            headers.append("Token", this.token);
        }
        return { headers: headers };
    };
    return BaseAuthService;
}());
export { BaseAuthService };
//# sourceMappingURL=base-auth-service.js.map