import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BaseAuthService } from '../base-auth-service';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/article';
import { Page } from 'src/app/models/page';
import { encrypt } from '../crypto/crypto.service';

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

  getVersion(id: number): Observable<Page<Article>> {
    return this.get<Page<Article>>(`${id}/versions`);
  }

  create(categoryId: number, title: string, text: string): Observable<Article> {
    return this.post<Article>("",
      {
        categoryId: categoryId,
        title: encrypt(title),
        text: encrypt(text)
      },
      () => {
        if (!title || !title.length) {
          throw Error("Please provide a title.");
        }
        if (!text || !text.length) {
          throw Error("Please provide a text.");
        }
      }
    );
  }

  edit(id: number, title: string, text: string): Observable<Article> {
    return this.put<Article>(id.toString(),
      {
        title: encrypt(title),
        text: encrypt(text)
      },
      () => {
        if (!title || !title.length) {
          throw Error("Please provide a title.");
        }
        if (!text || !text.length) {
          throw Error("Please provide a text.");
        }
      }
    );
  }
  
  remove(id: number): Observable<any> {
    return this.delete(`${id}`);
  }
}
