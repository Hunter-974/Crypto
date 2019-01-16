import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article/article.service';
import { Article } from 'src/app/models/article';
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/models/page';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class ArticleListComponent implements OnInit {

  categoryId: number;
  error: string;
  getListMethod: (i: number, s: number) => Observable<Page<Article>> =
    (i: number, s: number) => this.getList(i, s);

  constructor(
    private articleService: ArticleService,
    private router: Router,
    activatedRoute: ActivatedRoute
  ) {
    this.categoryId = parseInt(activatedRoute.snapshot.paramMap.get("categoryId"));
  }

  ngOnInit() {
  }

  getList(pageIndex: number, pageSize: number) {
    return this.articleService.getList(this.categoryId, pageIndex, pageSize);
  }

  open(id: number) {
    this.router.navigate(["/article", id.toString()]);
  }

  create() {
    this.router.navigate(["/article", "new", this.categoryId.toString()]);
  }
}
