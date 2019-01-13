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
import { CryptoService } from './services/crypto/crypto.service';
import { HomeModule } from './components/home/home.module';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from './components/header/header.module';
import { EncryptedPipe } from './pipes/encrypted.pipe';
import { CryptoModule } from './services/crypto/crypto.module';

export let InjectorInstance: Injector;

const routes: Route[] = [
  { path: "", component: HomeComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    EncryptedPipe
  ],
  imports: [
    CryptoModule.forRoot(),
    LoginModule,
    HomeModule,
    HeaderModule,
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
  constructor(private injector: Injector) {
    InjectorInstance = injector;
  }
}
