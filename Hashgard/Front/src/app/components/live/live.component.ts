// https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebrtcHub } from 'src/app/services/webrtc/webrtc.hub';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../base-component';
import { User } from 'src/app/models/user';
import { decrypt, encrypt } from 'src/app/services/crypto/crypto.service';
import { faPlay, faPause, faVideo } from '@fortawesome/free-solid-svg-icons';

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
  userData: {
    [userId: number]: {
      name: string,
      connection: RTCPeerConnection,
      stream: MediaStream,
      ready: boolean
    }
  } = {};

  get isStarted(): boolean {
    return this.stream && this.stream.active;
  }

  constructor(
    private webrtcHub: WebrtcHub,
    private route: ActivatedRoute) {

    super();
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
    this.webrtcHub.closed.subscribe(err => {
      this.error = err;
      this.startHub(() => {});
    });

    this.webrtcHub.offered.subscribe(obj => this.onRtcOffer(obj.user, obj.offer));
    this.webrtcHub.answered.subscribe(obj => this.onRtcAnswer(obj.user, obj.answer));
  }

  startHub(callback: () => void) {
    this.webrtcHub.start()
      .then(() => this.webrtcHub.listen(this.categoryId)
        .then(callback)
        .catch(err2 => this.error = err2.toString()))
      .catch(err1 => this.error = err1.toString());
  }

  stopHub(callback: () => void) {
    this.webrtcHub.stopListening(this.categoryId)
      .then(() => this.webrtcHub.stop()
        .then(callback)
        .catch(err2 => this.error = err2.toString()))
      .catch(err1 => this.error = err1.toString());
  }

  createUserData(user: User): RTCPeerConnection {
    let config: RTCConfiguration = {
      iceServers: [
        { urls:'stun:stun01.sipphone.com' },
        { urls:'stun:stun.ekiga.net' },
        { urls:'stun:stun.fwdnet.net' },
        { urls:'stun:stun.ideasip.com' },
        { urls:'stun:stun.iptel.org' },
        { urls:'stun:stun.rixtelecom.se' },
        { urls:'stun:stun.schlund.de' },
        { urls:'stun:stun.l.google.com:19302' },
        { urls:'stun:stun1.l.google.com:19302' },
        { urls:'stun:stun2.l.google.com:19302' },
        { urls:'stun:stun3.l.google.com:19302' },
        { urls:'stun:stun4.l.google.com:19302' },
        { urls:'stun:stunserver.org' },
        { urls:'stun:stun.softjoys.com' },
        { urls:'stun:stun.voiparound.com' },
        { urls:'stun:stun.voipbuster.com' },
        { urls:'stun:stun.voipstunt.com' },
        { urls:'stun:stun.voxgratia.org' },
        { urls:'stun:stun.xten.com' },
        {
          urls: 'turn:numb.viagenie.ca',
          credential: 'muazkh',
          username: 'webrtc@live.com'
        },
        {
          urls: 'turn:192.158.29.39:3478?transport=udp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808'
        },
        {
          urls: 'turn:192.158.29.39:3478?transport=tcp',
          credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
          username: '28224511:1379330808'
        }
      ],
      iceTransportPolicy: "all",
    };

    let connection = new RTCPeerConnection(config);

    var userData = {
      name: user.name,
      connection: connection,
      stream: null,
      ready: false
    };

    this.userData[user.id] = userData

    connection.ontrack = ev => {
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

    new RTCPeerConnection().createOffer(offerOptions)
      .then(offer => {
        this.currentOffer = offer;
        let offerString = JSON.stringify(offer);
        this.webrtcHub.offer(this.categoryId, this.user, offerString);
      })
      .catch(err => this.error = err);
  }

  onRtcAnswer(user: User, answer: string) {
    if (user && user.id && this.isDecrypted(answer)) {

      let userRtcConnection = this.userData[user.id].connection;

      let then = () => {
        let decryptedAnswer = JSON.parse(decrypt(answer));
        userRtcConnection.setLocalDescription(this.currentOffer)
          .then(() => userRtcConnection.setRemoteDescription(decryptedAnswer)
            .catch(err => this.error = err.toString()))
          .catch(err => this.error = err.toString());
      }

      if (!userRtcConnection) {
        userRtcConnection = this.createUserData(user);
        userRtcConnection.setLocalDescription(this.currentOffer)
          .then(then)
          .catch(err => this.error = err.toString());
      } else {
        then();
      }
    }
  }

  onRtcOffer(user: User, offer: string) {
    if (user && user.id && user.name && this.isDecrypted(offer)) {

      let userRtcConnection = this.userData[user.id].connection;
      if (!userRtcConnection) {
        userRtcConnection = this.createUserData(user);
      }

      let decryptedOffer = JSON.parse(decrypt(offer));
      userRtcConnection.setRemoteDescription(decryptedOffer)
        .then(() => this.sendRtcAnswer(userRtcConnection))
        .catch(err => this.error = err.toString());
    }
  }

  sendRtcAnswer(userRtcConnection: RTCPeerConnection) {
    let answerOptions: RTCAnswerOptions = {
      voiceActivityDetection: false
    };

    userRtcConnection.createAnswer(answerOptions)
      .then((answer) => {
        let encryptedAnswer = JSON.stringify(answer);
        this.webrtcHub.answer(this.categoryId, this.user, encryptedAnswer);
      })
      .catch();
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

      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          this.stream = stream;
          let videoTracks = stream.getVideoTracks();
          let audioTracks = stream.getAudioTracks();

          for (let userId in this.userData) {
            let userData = this.userData[userId];
            if (userData.connection) {
              if (videoTracks && videoTracks.length) {
                userData.connection.addTrack(videoTracks[0]);
              }
              if (audioTracks && audioTracks.length) {
                userData.connection.addTrack(audioTracks[0]);
              }
            }
          }
        })
        .catch(err => this.error = err.toString());
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
