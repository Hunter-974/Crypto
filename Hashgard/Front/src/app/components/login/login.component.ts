import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { duration } from 'moment';
import { BaseComponent } from '../base-component';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit {

  isSigningUp: boolean;

  name: string;
  password: string;
  sessionLifetime: string = "06:00:00";
  
  error: string;

  constructor(
    private authService: AuthService,
    logger: LoggerService
  ) {
    super(logger);
   }

  ngOnInit() {
  }

  signup() {
    this.error = null;

    var sessionLifetimeDuration = duration(this.sessionLifetime);
    this.authService.signup(this.name, this.password, sessionLifetimeDuration).subscribe(
      () => {
        this.isSigningUp = false;
        this.password = null;
      },
      error => this.logger.error(error)
    );
  }

  login() {
    this.error = null;
    var sessionLifetimeDuration = duration(this.sessionLifetime);
    this.authService.login(this.name, this.password, sessionLifetimeDuration).subscribe(
      () => {
        this.password = null;
      },
      error => this.logger.error(error)
    )
  }

  logout() {
    this.error = null;
    this.authService.logout().subscribe(
      () => {
        this.name = null;
        this.password = null;
      },
      error => this.logger.error(error)
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
