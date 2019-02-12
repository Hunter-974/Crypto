import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAuthService } from '../base-auth-service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { encrypt } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "category");
  }

  getList(): Observable<Category[]> {
    return this.get<Category[]>("")
  }

  create(name: string): Observable<Category> {
    return this.post<Category>("", { value: encrypt(name) },
      () => {
        if (!name || !name.length) {
          throw Error("Please specify a category name.");
        }
      }
    );
  }
}
