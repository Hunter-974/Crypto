import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthService } from './services/auth/auth.service';
import { ArticleService } from './services/article/article.service';
import { CommentService } from './services/comment/comment.service';
import { CategoryService } from './services/category/category.service';
import { ReactionService } from './services/reaction/reaction.service';
import { LoginModule } from './components/login/login.module';
import { RouterModule, Route } from '@angular/router';
import { HomeModule } from './components/home/home.module';
import { HttpClientModule } from '@angular/common/http';
import { HeaderModule } from './components/header/header.module';
import { CategoryListModule } from './components/category-list/category-list.module';
import { ArticleListModule } from './components/article-list/article-list.module';
import { ArticleModule } from './components/article/article.module';
import { PipesModule } from './pipes/pipes/pipes.module';
import { DirectivesModule } from './directives/directives/directives.module';
import { _sanitizeHtml } from '@angular/core/src/sanitization/html_sanitizer';
import {TranslateModule} from '@ngx-translate/core';
import { HomeComponent } from './components/home/home.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { ArticleComponent } from './components/article/article.component';
import { LiveComponent } from './components/live/live.component';
import { LiveModule } from './components/live/live.module';
import { WebrtcHub } from './services/webrtc/webrtc.hub';

const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'articles/:categoryId', component: ArticleListComponent },
  { path: 'live/:categoryId', component: LiveComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'article/new/:categoryId', component: ArticleComponent }  
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
    LiveModule,
    PipesModule,
    DirectivesModule,
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthService,
    ArticleService,
    CategoryService,
    CommentService,
    ReactionService,
    WebrtcHub
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}