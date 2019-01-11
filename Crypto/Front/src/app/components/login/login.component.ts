import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CryptoService } from '../../services/crypto/crypto.service';
import { duration } from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoggedIn: boolean;
  isSigningIn: boolean;

  name: string;
  password: string;
  location: string;

  decName: string;
  decLocation: string;

  constructor(
    private cryptoService: CryptoService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  login() {
    var encName = this.cryptoService.encrypt(this.name, "MesCouilles").toString();
    var encPassword = this.cryptoService.encrypt(this.password, "MesCouilles").toString();

    this.authService.logIn(encName, encPassword, duration("00:05:00")).subscribe(
      result => {},
      error => {}
    )
  }

  startCreating() {
    this.isSigningIn = true;
  }

  cancelCreating() {
    this.isSigningIn = false;
  }

  create() {

  }

  logout() {

  }

}
