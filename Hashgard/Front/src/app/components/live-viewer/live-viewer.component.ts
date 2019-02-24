import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';
import { IconDefinition, faVideo, faPlay, faStop, faPause } from '@fortawesome/free-solid-svg-icons';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LiveUserData } from 'src/app/models/live-user-data';

@Component({
  selector: 'app-live-viewer',
  templateUrl: './live-viewer.component.html',
  styleUrls: ['./live-viewer.component.css']
})
export class LiveViewerComponent extends BaseComponent implements OnInit {

  @Input() categoryId: number;
  @Input() userData: LiveUserData;

  @Output() recorded: EventEmitter<any> = new EventEmitter();
  @Output() stopped: EventEmitter<any> = new EventEmitter();

  @ViewChild("videoIn") videoInRef: ElementRef;
  @ViewChild("videoOut") videoOutRef: ElementRef;

  error: string;

  faVideo = faVideo;
  faStop = faStop;

  constructor(logger: LoggerService) { 
    super(logger);
  }

  ngOnInit() {
  }

  record() {
    this.recorded.emit();
  }

  stop() {
    this.stopped.emit();
  }
}