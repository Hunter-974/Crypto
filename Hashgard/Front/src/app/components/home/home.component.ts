import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit {

  constructor(logger: LoggerService) {
    super(logger);
   }

  ngOnInit() {
  }

}
