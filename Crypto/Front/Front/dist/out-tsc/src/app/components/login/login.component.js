var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CryptoService } from '../../services/crypto/crypto.service';
import { duration } from 'moment';
var LoginComponent = /** @class */ (function () {
    function LoginComponent(cryptoService, authService) {
        this.cryptoService = cryptoService;
        this.authService = authService;
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.login = function () {
        debugger;
        var encName = this.cryptoService.encrypt(this.name, "MesCouilles").toString();
        var encPassword = this.cryptoService.encrypt(this.password, "MesCouilles").toString();
        this.authService.logIn(encName, encPassword, duration("00:05:00")).subscribe(function (result) { }, function (error) { });
    };
    LoginComponent.prototype.startCreating = function () {
        this.isSigningIn = true;
    };
    LoginComponent.prototype.cancelCreating = function () {
        this.isSigningIn = false;
    };
    LoginComponent.prototype.create = function () {
    };
    LoginComponent.prototype.logout = function () {
    };
    LoginComponent = __decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        }),
        __metadata("design:paramtypes", [CryptoService,
            AuthService])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
//# sourceMappingURL=login.component.js.map