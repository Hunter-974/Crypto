import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAuthService } from '../base-auth-service';
import { Observable, ObjectUnsubscribedError } from 'rxjs';
import { User } from 'src/app/models/user';
import { Duration } from 'moment';
import { encrypt, hash } from '../crypto/crypto.module';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseAuthService {

  constructor(http: HttpClient) {
    super(http, "auth");
  }

  public signup(name: string, password: string, location: string, sessionLifetime: Duration): Observable<string> {
    var observable = new Observable<string>(
      subscriber => {
        this.http.post<string>(`${this.baseUrl}/signup`, {
          name: name,
          password: hash(password),
          location: location,
          sessionLifetime: this.getDurationString(sessionLifetime)
        }, this.getOptions()).subscribe(
          result => {
            BaseAuthService.token = result;
            subscriber.next(result);
            subscriber.complete();
          },
          error => {
            subscriber.error(error);
          });
      });
    return observable;
  }

  public login(name: string, password: string, sessionLifetime: Duration): Observable<string> {
    var observable = new Observable<string>(
      subscriber => {
        this.http.post<string>(`${this.baseUrl}/login`, {
          name: name,
          password: hash(password),
          sessionLifetime: this.getDurationString(sessionLifetime)
        }, this.getOptions()).subscribe(
          result => {
            BaseAuthService.token = result;
            subscriber.next(result);
            subscriber.complete();
          },
          error => {
            subscriber.error(error);
          });
      });
    return observable;
  }

  public logout(): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/logout`, {}, this.getOptions());
  }

  private getDurationString(duration: Duration): string {
    return `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`;
  }
}
