import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { duration } from 'moment';
import { BaseComponent } from '../base-component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit {

  isLoggedIn: boolean;
  isSigningUp: boolean;

  name: string;
  password: string;
  sessionLifetime: string = "01:00";
  
  error: string;

  constructor(
    private authService: AuthService
  ) {
    super();
   }

  ngOnInit() {
  }

  signup() {
    this.error = null;
    this.authService.signup(this.name, this.password, duration("00:05:00")).subscribe(
      result => {
        this.isSigningUp = false;
      },
      error => { this.error = error; }
    );
  }

  login() {
    this.error = null;
    var sessionLifetimeDuration = duration(this.sessionLifetime);
    this.authService.login(this.name, this.password, sessionLifetimeDuration).subscribe(
      result => { },
      error => { this.error = error.toString(); }
    )
  }

  logout() {
    this.error = null;
    this.authService.logout().subscribe(
      result => this.error = null,
      error => this.error = error
    );
  }

  startCreating() {
    this.error = null;
    this.isSigningUp = true;
  }

  cancelCreating() {
    this.error = null;
    this.isSigningUp = false;
  }

}
