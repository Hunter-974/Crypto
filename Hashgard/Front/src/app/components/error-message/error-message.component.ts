import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base-component';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css']
})
export class ErrorMessageComponent extends BaseComponent implements OnInit {

  @Input() error: string;
  @Input() addclass: string;

  constructor(logger: LoggerService) {
    super(logger);
   }

  ngOnInit() {
  }

}
