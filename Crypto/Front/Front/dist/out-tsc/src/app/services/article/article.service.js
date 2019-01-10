var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAuthService } from '../base-auth-service';
var ArticleService = /** @class */ (function (_super) {
    __extends(ArticleService, _super);
    function ArticleService(http) {
        return _super.call(this, http, "article") || this;
    }
    ArticleService.prototype.getList = function (categoryId, index, count) {
        return this.http.get(this.baseUrl + "/list/" + categoryId + "/" + index + "/" + count, this.getOptions());
    };
    ArticleService.prototype.get = function (id) {
        return this.http.get(this.baseUrl + "/" + id, this.getOptions());
    };
    ArticleService.prototype.getVersion = function (id) {
        return this.http.get(this.baseUrl + "/" + id + "/versions", this.getOptions());
    };
    ArticleService.prototype.create = function (categoryId, title, text) {
        return this.http.post("" + this.baseUrl, {
            categoryId: categoryId,
            title: title,
            text: text
        }, this.getOptions());
    };
    ArticleService.prototype.edit = function (id, title, text) {
        return this.http.put(this.baseUrl + "/" + id, {
            title: title,
            text: text
        }, this.getOptions());
    };
    ArticleService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], ArticleService);
    return ArticleService;
}(BaseAuthService));
export { ArticleService };
//# sourceMappingURL=article.service.js.map