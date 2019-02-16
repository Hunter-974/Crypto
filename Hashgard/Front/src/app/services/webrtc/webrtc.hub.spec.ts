import { TestBed } from '@angular/core/testing';

import { WebrtcHub } from './webrtc.hub';

describe('WebrtcHub', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebrtcHub = TestBed.get(WebrtcHub);
    expect(service).toBeTruthy();
  });
});
