import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAuthService } from '../base-auth-service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "category");
  }

  getParents(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}`, this.getOptions());
  }

  getChildren(parentId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/${parentId}`, this.getOptions());
  }

  createParent(name: string): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}`, name, this.getOptions());
  }

  createChild(parentId: number, name: string): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/${parentId}`, name, this.getOptions());
  }
}
