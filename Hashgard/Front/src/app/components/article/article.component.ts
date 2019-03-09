import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/article/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseAuthService } from 'src/app/services/base-auth-service';
import { BaseComponent } from '../base-component';
import { decrypt } from 'src/app/services/crypto/crypto.service';
import { Comment } from 'src/app/models/comment';
import { Page } from 'src/app/models/page';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent extends BaseComponent implements OnInit {

  isCreating: boolean;
  isEditing: boolean;
  article: Article;
  articleId: number;
  categoryId: number;
  newTitle: string;
  newText: string;
  error: string;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    activatedRoute: ActivatedRoute,
    logger: LoggerService
  ) {
    super(logger);
    let snapshot = activatedRoute.snapshot;
    if (snapshot.url.some(u => u.path == "new")) {
      this.isCreating = true;
      this.categoryId = parseInt(snapshot.paramMap.get("categoryId"));
    } else {
      this.articleId = parseInt(snapshot.paramMap.get("id"));
    }
  }

  ngOnInit() {
    if (!this.isCreating) {
      this.getArticle();
    }
  }

  getArticle() {
    this.articleService.getArticle(this.articleId).subscribe(
      result => { this.article = result; },
      error => this.logger.error(error)
    );
  }

  create() {
    this.error = null;
    this.articleService.create(this.categoryId, this.newTitle, this.newText).subscribe(
      result => this.router.navigate(["/article", result.id]),
      error => this.logger.error(error)
    );
  }

  startEdit() {
    this.isEditing = true;
    this.copyResult(this.article);
    this.error = null;
  }

  edit() {
    this.error = null;
    this.articleService.edit(this.article.id, this.newTitle, this.newText).subscribe(
      result => {
        result.reactionTypes = this.article.reactionTypes;
        result.comments = this.article.comments;
        this.article = result;
        this.isEditing = false;
      },
      error => this.logger.error(error)
    );
  }

  delete() {
    if (confirm("Are you sure you want to delete this article ?")) {
      this.error = null;
      this.articleService.remove(this.article.id).subscribe(
        () => this.router.navigate(["/categories"]),
        error => this.logger.error(error)
      );
    }
  }

  cancel() {
    this.isEditing = false;
    this.error = null;
  }

  copyResult(result: Article) {
    this.newText = decrypt(result.text);
    this.newTitle = decrypt(result.title);
  }

  clearResult() {
    this.newText = null;
    this.newTitle = null;
  }

  refreshComments(comments: Page<Comment>) {
    this.article.comments = comments;
  }
}
