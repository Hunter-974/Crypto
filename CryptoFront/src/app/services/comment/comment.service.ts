import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAuthService } from '../base-auth-service';
import { Page } from 'src/app/models/page';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "comment");
  }

  getForArticle(articleId: number, index: number, count: number): Observable<Page<Comment>> {
    return this.http.get<Page<Comment>>(`${this.baseUrl}/article/${articleId}/${index}/${count}`, this.getOptions());
  }

  getForComment(parentId: number, index: number, count: number): Observable<Page<Comment>> {
    return this.http.get<Page<Comment>>(`${this.baseUrl}/comment/${parentId}/${index}/${count}`, this.getOptions());
  }

  getAllVersions(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/${id}/versions`, this.getOptions());
  }

  createForArticle(articleId: number, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/article/${articleId}`, text, this.getOptions());
  }

  createForComment(parentId: number, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/comment/${parentId}`, text, this.getOptions());
  }

  edit(id: number, text: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}/${id}`, text, this.getOptions());
  }
}
