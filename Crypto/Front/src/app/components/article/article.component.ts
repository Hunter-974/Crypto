import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article';
import { ArticleService } from 'src/app/services/article/article.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  creating: boolean;
  editing: boolean;
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
      this.creating = true;
      this.categoryId = parseInt(snapshot.paramMap.get("categoryId"));
    } else {
      this.articleId = parseInt(snapshot.paramMap.get("id"));
    }
  }

  ngOnInit() {
    if (!this.creating) {
      this.getArticle();
    }
  }

  getArticle() {
    this.articleService.getArticle(this.articleId).subscribe(
      result => { this.article = result; },
      error => { this.error = error.toString(); }
    );
  }

  edit() {
    this.editing = true;
    this.error = null;
  }

  cancel() {
    this.editing = false;
    this.error = null;
  }

  save() {
    this.error = null;
    this.articleService.edit(this.article.id, this.newTitle, this.newText).subscribe(
      result => {
        this.article = result;
        this.newText = null;
        this.newTitle = null;
      },
      error => { this.error = error.toString(); }
    );
  }

  create() {
    this.error = null;
    this.articleService.create(this.categoryId, this.newTitle, this.newText).subscribe(
      result => {
        this.router.navigate(["/article", result.id]);
      },
      error => { this.error = error.toString(); }
    );
  }

}
