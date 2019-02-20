// https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebrtcHub } from 'src/app/services/webrtc/webrtc.hub';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../base-component';
import { User } from 'src/app/models/user';
import { decrypt, encrypt } from 'src/app/services/crypto/crypto.service';
import { faPlay, faPause, faVideo } from '@fortawesome/free-solid-svg-icons';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LiveUserData } from 'src/app/models/live-user-data';
import { RtcConfig } from 'src/app/models/rtc-config';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent extends BaseComponent implements OnInit, OnDestroy {

  faVideo = faVideo;
  faPlay = faPlay;
  faPause = faPause;

  categoryId: number;
  error: string;

  stream: MediaStream;
  currentOffer: RTCSessionDescriptionInit;
  userDataDict: {
    [userId: number]: LiveUserData
  } = {};

  get isStarted(): boolean {
    return this.stream && this.stream.active;
  }

  constructor(
    private webrtcHub: WebrtcHub,
    private route: ActivatedRoute,
    logger: LoggerService) {

    super(logger);
  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.params["categoryId"];
    this.initHubEvents();
    this.startHub(() => this.sendRtcOffer());
  }

  ngOnDestroy() {
    this.stopHub(() => {});
  }

  initHubEvents() {
    console.log("begin initHubEvents");
    
    this.webrtcHub.closed.subscribe(err => {
      if (err) {
        this.logger.error(err)
        this.startHub(() => {});
      }
    });

    this.webrtcHub.offered.subscribe(obj => this.onRtcOffer(obj.user, obj.offer, obj.senderCid));
    this.webrtcHub.answered.subscribe(obj => this.onRtcAnswer(obj.user, obj.answer));
    this.webrtcHub.iceCandidateReceived.subscribe(obj => this.onRtcIceCandidate(obj.user, obj.iceCandidate));

    console.log("end initHubEvents");
  }

  startHub(callback: () => void) {
    this.logger.message("begin startHub");
    
    this.webrtcHub.start()
      .then(() => {
        this.logger.message("begin hub.listen");
        this.webrtcHub.listen(this.categoryId)
        .then(() => {
          callback();
          this.logger.message("begin hub.listen");
        })
        .catch(err2 => this.logger.error(err2))
      })
      .catch(err1 => this.logger.error(err1));
  }

  stopHub(callback: () => void) {
    this.logger.message("begin hub stop");
    this.webrtcHub.stop()
    .then(() => {
      this.logger.message("end hub stop");
      callback();
    })
    .catch(err => this.logger.error(err));
  }

  createUserData(user: User): RTCPeerConnection {
    let connection = new RTCPeerConnection();

    var userData: LiveUserData = {
      name: user.name,
      connection: connection,
      stream: null,
      ready: false
    };

    this.userDataDict[user.id] = userData

    connection.onicecandidate = ev => {
      this.webrtcHub.iceCandidate
    }

    connection.ontrack = ev => {
      this.logger.message("received track")
      if (ev.streams && ev.streams.length) {
        userData.stream = ev.streams[0];
        userData.ready = true
      }
    };

    return connection;
  }

  sendRtcOffer() {
    let offerOptions: RTCOfferOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true, 
      voiceActivityDetection: false,
      iceRestart: false
    };

    this.logger.message("begin createOffer");
    new RTCPeerConnection().createOffer(offerOptions)
      .then(offer => {
        this.logger.message("end createOffer, begin hub offer");
        this.currentOffer = offer;
        let offerString = JSON.stringify(offer);
        this.webrtcHub.offer(this.categoryId, this.user, offerString)
          .then(() => this.logger.message("end hub offer"))
          .catch(err => this.logger.error(err));
      })
      .catch(err => this.logger.error(err));
  }

  onRtcOffer(user: User, offer: string, senderCid: string) {
    this.logger.message("hub offer received");

    if (user && user.id && user.name && this.isDecrypted(offer)) {

      let userRtcConnection;
      if (this.userDataDict[user.id]) {
        userRtcConnection = this.userDataDict[user.id].connection;
      }
      if (!userRtcConnection) {
        userRtcConnection = this.createUserData(user);
      }

      let decryptedOffer = JSON.parse(decrypt(offer));
      this.logger.message("begin setRemoteDescription");
      userRtcConnection.setRemoteDescription(decryptedOffer)
        .then(() => {
          this.logger.message("end setRemoteDescription");
          this.sendRtcAnswer(userRtcConnection, senderCid);
        })
        .catch(err => this.logger.error(err));
    }
  }

  sendRtcAnswer(userRtcConnection: RTCPeerConnection, senderCid: string) {
    let answerOptions: RTCAnswerOptions = {
      voiceActivityDetection: false
    };

    this.logger.message("begin createAnswer");
    userRtcConnection.createAnswer(answerOptions)
      .then((answer) => {
        this.logger.message("end createAnswer, begin hub answer");
        let encryptedAnswer = encrypt(JSON.stringify(answer));
        this.webrtcHub.answer(this.categoryId, this.user, encryptedAnswer, senderCid)
          .then(() => this.logger.message("end hub answer"))
          .catch(err => this.logger.error(err));
      })
      .catch(err => this.logger.error(err));
  }

  onRtcAnswer(user: User, answer: string) {
    this.logger.message("hub answer received");

    if (user && user.id && this.isDecrypted(answer)) {

      let userRtcConnection;
      if (this.userDataDict[user.id]) {
        userRtcConnection = this.userDataDict[user.id].connection;
      }
      if (!userRtcConnection) {
        userRtcConnection = this.createUserData(user);
      }

      this.logger.message("begin setLocalDescription");
      userRtcConnection.setLocalDescription(this.currentOffer)
        .then(() => {
          this.logger.message("end setLocalDescription");
          let decryptedAnswer = JSON.parse(decrypt(answer));
          this.logger.message("begin setRemoteDescription");
          userRtcConnection.setRemoteDescription(decryptedAnswer)
            .then(() => this.logger.message("end setRemoteDescription"))
            .catch(err2 => this.logger.error(err2));
        })
        .catch(err1 => this.logger.error(err1));
    }
  }

  sendRtcIceCandidate(user: User, iceCandidate: RTCIceCandidate) {
    this.logger.message("begin send ice candidate");

    var encryptedIceCandidate = encrypt(JSON.stringify(iceCandidate));
    this.webrtcHub.iceCandidate(this.categoryId, this.user, encryptedIceCandidate)
      .then(() => this.logger.message("end send ice candidate"))
      .catch(err => this.logger.error(err));
  }

  onRtcIceCandidate(user: User, iceCandidate: string) {
    this.logger.message("ice candidate received");
    if (user && user.id && this.isDecrypted(iceCandidate)) {

      let userRtcConnection: RTCPeerConnection;
      if (this.userDataDict[user.id]) {
        userRtcConnection = this.userDataDict[user.id].connection;
        let decryptedIceCandidate = JSON.parse(decrypt(iceCandidate));

        this.logger.message("begin add ice candidate");
        userRtcConnection.addIceCandidate(decryptedIceCandidate)
          .then(() => {
            this.logger.message("end add ice candidate");
          })
          .catch(err => this.logger.error(err));
      }
    }
  }

  startStreaming() {
    if (!this.isStarted) {
      let constraints = {
        video: {
          width: 800,
          height: 600
        }, 
        audio: true 
      };

      this.logger.message("begin getUserMedia");
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          this.logger.message("end getUserMedia");
          this.stream = stream;
          let videoTracks = stream.getVideoTracks();
          let audioTracks = stream.getAudioTracks();

          for (let userId in this.userDataDict) {
            let userData = this.userDataDict[userId];
            if (userData.connection) {
              if (videoTracks && videoTracks.length) {
                this.logger.message("add video track for user " + userData.name);
                userData.connection.addTrack(videoTracks[0]);
              }
              if (audioTracks && audioTracks.length) {
                this.logger.message("add audio track for user " + userData.name);
                userData.connection.addTrack(audioTracks[0]);
              }
            }
          }
        })
        .catch(err => this.logger.error(err));
    }
  }

  currentStart() {
    this.startStreaming();
  }

  currentPause() {

  }

  remoteStart(userId: number) {

  }

  remotePause(userId: number) {

  }

}
