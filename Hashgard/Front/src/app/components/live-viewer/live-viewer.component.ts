import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';
import { IconDefinition, faVideo, faPlay, faStop, faPause } from '@fortawesome/free-solid-svg-icons';
import { LoggerService } from 'src/app/services/logger/logger.service';

@Component({
  selector: 'app-live-viewer',
  templateUrl: './live-viewer.component.html',
  styleUrls: ['./live-viewer.component.css']
})
export class LiveViewerComponent extends BaseComponent implements OnInit {

  @Input() categoryId: number;
  @Input() title: string;
  @Input() recordButton: boolean;
  @Input() playButton: IconDefinition;
  @Input() pauseButton: IconDefinition;
  @Input() stopButton: IconDefinition;
  @Input() stream: MediaStream;

  @Output() played: EventEmitter<any> = new EventEmitter();
  @Output() paused: EventEmitter<any> = new EventEmitter();
  @Output() recorded: EventEmitter<any> = new EventEmitter();
  @Output() stopped: EventEmitter<any> = new EventEmitter();

  @ViewChild("video") videoRef: ElementRef;

  error: string;

  faVideo = faVideo;
  faPlay = faPlay;
  faStop = faStop;
  faPause = faPause;

  constructor(logger: LoggerService) { 
    super(logger);
  }

  ngOnInit() {
    let nativeVideo: HTMLVideoElement = this.videoRef.nativeElement;
    nativeVideo.onloadedmetadata = (e) => {
      nativeVideo.play()
        .catch(err => this.logger.error(err));
    };
  }

  play() {
    this.played.emit();
  }

  pause() {
    this.paused.emit();
  }

  record() {
    this.recorded.emit();
  }

  stop() {
    this.stopped.emit();
  }
}