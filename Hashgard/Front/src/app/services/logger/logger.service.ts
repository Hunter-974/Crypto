import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  error(err: any) {
    if (err.message && err.stack) {
      console.error(err.name);
      console.error(err.stack);
    } else {
      console.error(err.toString());
    }
  }

  message(msg: String) {
    console.log(msg);
  }
}
