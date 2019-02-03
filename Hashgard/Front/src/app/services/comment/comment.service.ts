import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAuthService } from '../base-auth-service';
import { Page } from 'src/app/models/page';
import { Observable } from 'rxjs';
import { Comment } from '../../models/comment';
import { encrypt } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "comment");
  }

  getForArticle(articleId: number, index: number, count: number): Observable<Page<Comment>> {
    return this.get<Page<Comment>>(`article/${articleId}/${index}/${count}`);
  }

  getForComment(parentId: number, index: number, count: number): Observable<Page<Comment>> {
    return this.get<Page<Comment>>(`comment/${parentId}/${index}/${count}`);
  }

  getAllVersions(id: number): Observable<Comment[]> {
    return this.get<Comment[]>(`${id}/versions`);
  }

  createForArticle(articleId: number, text: string): Observable<Comment> {
    return this.post<Comment>(`article/${articleId}`,
      { value: encrypt(text) },
      () => {
        if (!text || !text.length) {
          throw Error("Please provide a text.");
        }
      }
    );
  }

  createForComment(parentId: number, text: string): Observable<Comment> {
    return this.post<Comment>(`comment/${parentId}`,
      { value: encrypt(text) },
      () => {
        if (!text || !text.length) {
          throw Error("Please provide a text.");
        }
      }
    );
  }

  edit(id: number, text: string): Observable<Comment> {
    return this.put<Comment>(`${id}`,
      { value: encrypt(text) },
      () => {
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
