import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseAuthService } from '../base-auth-service';
import { Reaction } from 'src/app/models/reaction';
import { ReactionType } from 'src/app/models/reaction-type';
import { encrypt } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class ReactionService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "reaction");
  }

  getForArticle(articleId: number): Observable<ReactionType[]> {
    return this.get<ReactionType[]>(`article/${articleId}`);
  }

  getForComment(commentId: number): Observable<Reaction[]> {
    return this.get<Reaction[]>(`comment/${commentId}`);
  }

  createForArticle(articleId: number, name: string): Observable<ReactionType> {
    return this.post<ReactionType>(`article/${articleId}`,
      { value: encrypt(name) },
      () => {
        if (!name || !name.length) {
          throw Error("Please provide a reaction type.");
        }
      }
    );
  }

  createForComment(commentId: number, name: string): Observable<ReactionType> {
    return this.post<ReactionType>(`comment/${commentId}`,
      { value: encrypt(name) },
      () => {
        if (!name || !name.length) {
          throw Error("Please provide a reaction type.");
        }
      }
    );
  }

  add(reactionTypeId: number): Observable<ReactionType> {
    return this.post<ReactionType>(reactionTypeId.toString(), null);
  }

  remove(reactionTypeId: number): Observable<ReactionType> {
    return this.delete<ReactionType>(reactionTypeId.toString());
  }
}
