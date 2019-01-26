import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthService } from './services/auth/auth.service';
import { ArticleService } from './services/article/article.service';
import { CommentService } from './services/comment/comment.service';
import { CategoryService } from './services/category/category.service';
import { ReactionService } from './services/reaction/reaction.service';
import { LoginModule } from './components/login/login.module';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, Route } from '@angular/router';
import { HomeModule } from './components/home/home.module';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from './components/header/header.module';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryListModule } from './components/category-list/category-list.module';
import { ArticleComponent } from './components/article/article.component';
import { ArticleListModule } from './components/article-list/article-list.module';
import { ArticleModule } from './components/article/article.module';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { ReactionListComponent } from './components/reaction-list/reaction-list.component';
import { ReactionComponent } from './components/reaction/reaction.component';
import { BaseAuthService } from './services/base-auth-service';
import { CryptoService } from './services/crypto/crypto.service';
import { PipesModule } from './pipes/pipes/pipes.module';
import { IfIsLoggedInDirective } from './directives/if-is-logged-in/if-is-logged-in.directive';
import { IfIsOwnerDirective } from './directives/if-is-owner/if-is-owner.directive';
import { IfHasKeyDirective } from './directives/if-has-key/if-has-key.directive';
import { DecryptDirective } from './directives/decrypt/decrypt.directive';
import { DirectivesModule } from './directives/directives/directives.module';

const routes: Route[] = [
  { path: "", component: HomeComponent },
  { path: "categories", component: CategoryListComponent },
  { path: "articles/:categoryId", component: ArticleListComponent },
  { path: "article/:id", component: ArticleComponent },
  { path: "article/new/:categoryId", component: ArticleComponent }
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    LoginModule,
    HomeModule,
    HeaderModule,
    CategoryListModule,
    ArticleListModule,
    ArticleModule,
    PipesModule,
    DirectivesModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [
    AuthService,
    ArticleService,
    CategoryService,
    CommentService,
    ReactionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export let crypt = {
  encrypt(value: string): string {
    return CryptoService.encrypt(value);
  },

  decrypt(value: string): string {
    return CryptoService.decrypt(value);
  },

  hash(value: string): string {
    return CryptoService.hash(value);
  },

  get hasKey(): boolean {
    return CryptoService.hasKey();
  },

  set key(key: string) {
    CryptoService.setKey(key);
  }
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

const _global = window as any;
_global.crypt = crypt;
_global.auth = auth;
