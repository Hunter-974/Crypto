import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/article/article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseAuthService } from 'src/app/services/base-auth-service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

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
    activatedRoute: ActivatedRoute
  ) {
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
      result => this.copyResult(result),
      error => this.error = error.toString()
    );
  }

  edit() {
    this.isEditing = true;
    this.error = null;
  }

  cancel() {
    this.isEditing = false;
    this.error = null;
  }

  save() {
    this.error = null;
    this.articleService.edit(this.article.id, this.newTitle, this.newText).subscribe(
      result => this.copyResult(result),
      error => this.error = error.toString()
    );
  }

  create() {
    this.error = null;
    this.articleService.create(this.categoryId, this.newTitle, this.newText).subscribe(
      result => this.router.navigate(["/article", result.id]),
      error => this.error = error.toString()
    );
  }

  copyResult(result: Article) {
    this.article = result;
    this.newText = result.text;
    this.newTitle = result.title;
  }

  get isOwner(): boolean {
    return this.article && this.article.user.id == BaseAuthService.userId;
  }

}
