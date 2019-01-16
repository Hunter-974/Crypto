import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BaseAuthService } from '../base-auth-service';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/article';
import { Page } from 'src/app/models/page';
import { encrypt } from '../crypto/crypto.module';

@Injectable({
  providedIn: 'root'
})
export class ArticleService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "article");
  }
  
  getList(categoryId: number, index: number, count: number): Observable<Page<Article>>
  {
    return this.get<Page<Article>>(`list/${categoryId}/${index}/${count}`);
  }

  getArticle(id: number): Observable<Article>
  {
    return this.get<Article>(`${id}`);
  }

  getVersion(id: number): Observable<Article[]> {
    return this.get<Article[]>(`${id}/versions`);
  }

  create(categoryId: number, title: string, text: string): Observable<Article> {
    return this.post<Article>("",
      {
        categoryId: categoryId,
        title: encrypt(title),
        text: encrypt(text)
      },
      (subscriber) => {
        if (!title || !title.length) {
          subscriber.error(Error("Please provide a title."));
        }
        if (!text || !text.length) {
          subscriber.error(Error("Please provide a text."));
        }
      }
    );
  }

  edit(id: number, title: string, text: string): Observable<Article> {
    return this.put<Article>(`${id}`,
      {
        title: encrypt(title),
        text: encrypt(text)
      },
      (subscriber) => {
        if (!title || !title.length) {
          subscriber.error(Error("Please provide a title."));
        }
        if (!text || !text.length) {
          subscriber.error(Error("Please provide a text."));
        }
      }
    );
  }
}
