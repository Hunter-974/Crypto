import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BaseAuthService } from '../base-auth-service';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/article';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService extends BaseAuthService {

  constructor(
    http: HttpClient,
    cryptoService: CryptoService
  ) {
    super(http, "article");
  }
  
  getList(categoryId: number, index: number, count: number): Observable<Article[]>
  {
    return this.http.get<Article[]>(`${this.baseUrl}/list/${categoryId}/${index}/${count}`, this.getOptions());
  }

  get(id: number): Observable<Article>
  {
    return this.http.get<Article>(`${this.baseUrl}/${id}`, this.getOptions());
  }

  getVersion(id: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.baseUrl}/${id}/versions`, this.getOptions());
  }

  create(categoryId: number, title: string, text: string): Observable<Article> {
    return this.http.post<Article>(`${this.baseUrl}`, {
      categoryId: categoryId,
      title: title,
      text: text
    }, this.getOptions());
  }

  edit(id: number, title: string, text: string): Observable<Article> {
    return this.http.put<Article>(`${this.baseUrl}/${id}`, {
      title: title,
      text: text
    }, this.getOptions());
  }
}
