import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseAuthService } from '../base-auth-service';
import { Reaction } from 'src/app/models/reaction';
import { encrypt } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class ReactionService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "reaction");
  }

  getForArticle(articleId: number): Observable<Reaction[]> {
    return this.get<Reaction[]>(`article/${articleId}`);
  }

  getForComment(commentId: number): Observable<Reaction[]> {
    return this.get<Reaction[]>(`comment/${commentId}`);
  }

  setForArticle(articleId: number, reactionType: string): Observable<Reaction> {
    return this.post<Reaction>(`article/${articleId}`,
      { value: encrypt(reactionType) },
      () => {
        if (!reactionType || !reactionType.length) {
          throw Error("Please provide a reaction type.");
        }
      }
    );
  }

  setForComment(commentId: number, reactionType: string): Observable<Reaction> {
    return this.post<Reaction>(`comment/${commentId}`,
      { value: encrypt(reactionType) },
      () => {
        if (!reactionType || !reactionType.length) {
          throw Error("Please provide a reaction type.");
        }
      }
    );
  }
}
