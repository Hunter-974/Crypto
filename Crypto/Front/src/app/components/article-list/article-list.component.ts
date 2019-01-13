import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article/article.service';
import { Article } from 'src/app/models/article';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  categoryId: number;
  articlePage: Page<Article>;
  error: string;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    activatedRoute: ActivatedRoute
  ) {
    this.categoryId = parseInt(activatedRoute.snapshot.paramMap.get("categoryId"));
  }

  ngOnInit() {
    this.getArticleList();
  }

  getArticleList() {
    this.articleService.getList(this.categoryId, 0, 20).subscribe(
      result => { this.articlePage = result; },
      error => { this.error = error.toString(); }
    );
  }

  open(id: number) {
    this.router.navigate(["/article", id.toString()]);
  }

  create() {
    this.router.navigate(["/article", "new", this.categoryId.toString()]);
  }


}
