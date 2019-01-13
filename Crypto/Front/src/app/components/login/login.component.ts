import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { duration, Duration } from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoggedIn: boolean;
  isSigningUp: boolean;

  name: string;
  password: string;
  location: string;
  sessionLifetime: string = "01:00";
  
  error: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  signup() {
    this.authService.signup(this.name, this.password, this.location, duration("00:05:00")).subscribe(
      result => {
        this.error = null;
        this.isSigningUp = false;
        this.isLoggedIn = true;
      },
      error => { this.error = error; }
    );
  }

  login() {
    var sessionLifetimeDuration = duration(this.sessionLifetime);
    this.authService.login(this.name, this.password, sessionLifetimeDuration).subscribe(
      result => {
        this.error = null;
        this.isLoggedIn = true;
      },
      error => { this.error = error.toString(); }
    )
  }

  logout() {
    this.error = null;
    this.authService.logout().subscribe(
      result => {
        this.error = null;
        this.isLoggedIn = false;
      },
      error => { this.error = error; }
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
