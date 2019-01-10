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
var ReactionService = /** @class */ (function (_super) {
    __extends(ReactionService, _super);
    function ReactionService(http) {
        return _super.call(this, http, "reaction") || this;
    }
    ReactionService.prototype.getForArticle = function (articleId) {
        return this.http.get(this.baseUrl + "/article/" + articleId, this.getOptions());
    };
    ReactionService.prototype.getForComment = function (commentId) {
        return this.http.get(this.baseUrl + "/comment/" + commentId, this.getOptions());
    };
    ReactionService.prototype.setForArticle = function (articleId, reactionType) {
        return this.http.post(this.baseUrl + "/article/" + articleId, reactionType, this.getOptions());
    };
    ReactionService.prototype.setForComment = function (commentId, reactionType) {
        return this.http.post(this.baseUrl + "/comment/" + commentId, reactionType, this.getOptions());
    };
    ReactionService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], ReactionService);
    return ReactionService;
}(BaseAuthService));
export { ReactionService };
//# sourceMappingURL=reaction.service.js.map