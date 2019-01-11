import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAuthService } from '../base-auth-service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { Duration } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "auth");
  }

  signIn(name: string, password: string, location: string, sessionLifetime: Duration): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/signin`, {
      name: name,
      password: password,
      location: location,
      sessionLifetime: sessionLifetime.toISOString()
    }, this.getOptions());
  }

  logIn(name: string, password: string, sessionLifetime: Duration): Observable<string> {
    var timespan = `${sessionLifetime.hours()}:${sessionLifetime.minutes()}:${sessionLifetime.seconds()}`;
    return this.http.post<string>(`${this.baseUrl}/login`, {
      name: name,
      password: password,
      sessionLifetime: timespan
    }, this.getOptions());
  }

  logOut(token: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, {}, this.getOptions());
  }
}
