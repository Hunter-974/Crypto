import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit {

  constructor(logger: LoggerService) { 
    super(logger);
  }

  ngOnInit() {
  }

}
