import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAuthService } from '../base-auth-service';
import { Page } from 'src/app/models/page';
import { Observable } from 'rxjs';
import { crypt } from '../../app.module';
import { Comment } from '../../models/comment';

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
      { value: crypt.encrypt(text) },
      (subscriber) => {
        if (!text || !text.length) {
          subscriber.error(Error("Please provide a text."));
        }
      }
    );
  }

  createForComment(parentId: number, text: string): Observable<Comment> {
    return this.post<Comment>(`comment/${parentId}`,
      { value: crypt.encrypt(text) },
      (subscriber) => {
        if (!text || !text.length) {
          subscriber.error(Error("Please provide a text."));
        }
      }
    );
  }

  edit(id: number, text: string): Observable<Comment> {
    return this.put<Comment>(`${id}`,
      { value: crypt.encrypt(text) },
      (subscriber) => {
        if (!text || !text.length) {
          subscriber.error(Error("Please provide a text."));
        }
      }
    );
  }
}
