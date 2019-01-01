import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import { HttpClient, HttpClientModule } from '@angular/common/http';

const routes: Route[] = [
  { path: "", component: HomeComponent }
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    LoginModule,
    HomeModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [
    CryptoService,
    AuthService,
    ArticleService,
    CategoryService,
    CommentService,
    ReactionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
