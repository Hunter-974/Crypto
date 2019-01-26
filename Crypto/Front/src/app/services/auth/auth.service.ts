import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAuthService } from '../base-auth-service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { Duration } from 'moment';
import { crypt } from '../../app.module';
import { AuthResult } from 'src/app/models/auth-result';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "auth");
  }

  public signup(name: string, password: string, sessionLifetime: Duration): Observable<AuthResult> {
    return this.post<AuthResult>("signup",
      {
        name: name,
        password: crypt.hash(password),
        sessionLifetime: this.getDurationString(sessionLifetime)
      },
      (subscriber) => {
        if (!name || !name.length || !password || !password.length) {
          subscriber.error(Error("Please provide a name and a password."));
        }
      },
      (result) => {
        BaseAuthService.token = result.token;
        BaseAuthService._userId = result.userId;
      }
    );
  }

  public login(name: string, password: string, sessionLifetime: Duration): Observable<AuthResult> {
    return this.post<AuthResult>("login",
      {
        name: name,
        password: crypt.hash(password),
        sessionLifetime: this.getDurationString(sessionLifetime)
      },
      (subscriber) => {
        if (!name || !name.length || !password || !password.length) {
          subscriber.error(Error("Please provide a name and a password."));
        }
      },
      (result) => {
        BaseAuthService.token = result.token;
        BaseAuthService._userId = result.userId;
      }
    );
  }

  public logout(): Observable<User> {

    return this.post("logout", null,
      subscriber => { },
      result => {
        BaseAuthService._userId = null;
        BaseAuthService.token = null;
      }
    );
  }

  private getDurationString(duration: Duration): string {
    return `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`;
  }
}
