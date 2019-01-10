import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseAuthService } from '../base-auth-service';
import { Reaction } from 'src/app/models/reaction';

@Injectable({
  providedIn: 'root'
})
export class ReactionService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "reaction");
  }

  getForArticle(articleId: number): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.baseUrl}/article/${articleId}`, this.getOptions());
  }

  getForComment(commentId: number): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.baseUrl}/comment/${commentId}`, this.getOptions());
  }

  setForArticle(articleId: number, reactionType: string): Observable<Reaction> {
    return this.http.post<Reaction>(`${this.baseUrl}/article/${articleId}`, reactionType, this.getOptions());
  }

  setForComment(commentId: number, reactionType: string): Observable<Reaction> {
    return this.http.post<Reaction>(`${this.baseUrl}/comment/${commentId}`, reactionType, this.getOptions());
  }
}
