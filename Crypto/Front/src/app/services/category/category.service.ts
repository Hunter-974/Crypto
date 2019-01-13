import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAuthService } from '../base-auth-service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { encrypt } from '../crypto/crypto.module';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "category");
  }

  getParents(): Observable<Category[]> {
    return this.get<Category[]>("")
  }

  getChildren(parentId: number): Observable<Category[]> {
    return this.get<Category[]>(`${parentId}`);
  }

  createParent(name: string): Observable<Category> {
    return this.post<Category>("", { value: encrypt(name) },
      (subscriber) => {
        if (!name || !name.length) {
          subscriber.error(Error("Please specify a category name."));
        }
      }
    );
  }

  createChild(parentId: number, name: string): Observable<Category> {
    return this.post<Category>(`${parentId}`, { value: encrypt(name) },
      (subscriber) => {
        if (!name || !name.length) {
          subscriber.error(Error("Please specify a category name."));
        }
      }
    );
  }
}
