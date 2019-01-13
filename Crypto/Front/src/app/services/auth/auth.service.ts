import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAuthService } from '../base-auth-service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { Duration } from 'moment';
import { hash, encrypt } from '../crypto/crypto.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "auth");
  }

  public signup(name: string, password: string, location: string, sessionLifetime: Duration): Observable<string> {
    return this.post("signup",
      {
        name: name,
        password: hash(password),
        location: encrypt(location),
        sessionLifetime: this.getDurationString(sessionLifetime)
      },
      (subscriber) => {
        if (!name || !name.length || !password || !password.length) {
          subscriber.error(Error("Please provide a name and a password."));
        }
      },
      (result) => { BaseAuthService.token = result; }
    );
  }

  public login(name: string, password: string, location: string, sessionLifetime: Duration): Observable<string> {
    return this.post("login",
      {
        name: name,
        password: hash(password),
        location: encrypt(location),
        sessionLifetime: this.getDurationString(sessionLifetime)
      },
      (subscriber) => {
        if (!name || !name.length || !password || !password.length) {
          subscriber.error(Error("Please provide a name and a password."));
        }
      },
      (result) => { BaseAuthService.token = result; }
    );
  }

  public logout(): Observable<User> {
    return this.post("logout", null);
  }

  private getDurationString(duration: Duration): string {
    return `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`;
  }
}
