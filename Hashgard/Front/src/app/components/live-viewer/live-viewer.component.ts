import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../base-component';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-live-viewer',
  templateUrl: './live-viewer.component.html',
  styleUrls: ['./live-viewer.component.css']
})
export class LiveViewerComponent extends BaseComponent {

  _stream: MediaStream

  get stream(): MediaStream {
    return this._stream;
  }

  @Input() set stream(value: MediaStream) {
    this._stream = value;
    if (this.videoRef && this._stream) {
      let nativeVideo: HTMLVideoElement = this.videoRef.nativeElement;
      nativeVideo.onloadedmetadata = (e) => {
        nativeVideo.play().catch(err => this.error = err.toString());
      };
      nativeVideo.srcObject = this._stream;
    }
  }

  @Input() categoryId: number;
  @Input() title: string;
  @Input() playIcon: IconDefinition;
  @Input() pauseIcon: IconDefinition;

  @Output() started: EventEmitter<any> = new EventEmitter();
  @Output() paused: EventEmitter<any> = new EventEmitter();

  @ViewChild("video") videoRef: ElementRef;

  error: string;

  constructor() { 
    super();
  }

  start() {
    this.started.emit();
  }

  pause() {
    this.paused.emit();
  }
}