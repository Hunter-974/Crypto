import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent extends BaseComponent implements OnInit {

  constructor(logger: LoggerService) {
    super(logger);
   }

  ngOnInit() {
  }

}
