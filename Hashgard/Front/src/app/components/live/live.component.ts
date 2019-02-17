// https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebrtcHub } from 'src/app/services/webrtc/webrtc.hub';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../base-component';
import { User } from 'src/app/models/user';
import { decrypt, encrypt } from 'src/app/services/crypto/crypto.service';
import { faPlay, faPause, faVideo } from '@fortawesome/free-solid-svg-icons';
import { LoggerService } from 'src/app/services/logger/logger.service';

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
      this.logger.error(err)
      this.startHub(() => {});
    });

    this.webrtcHub.offered.subscribe(obj => this.onRtcOffer(obj.user, obj.offer));
    this.webrtcHub.answered.subscribe(obj => this.onRtcAnswer(obj.user, obj.answer));

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
    this.logger.message("begin hub stopListening");

    this.webrtcHub.stopListening(this.categoryId)
      .then(() => {
        this.logger.message("end hub stopListening, begin hub stop");
        this.webrtcHub.stop()
        .then(() => {
          this.logger.message("end hub stop");
          callback();
        })
        .catch(err2 => this.logger.error(err2));
      })
      .catch(err1 => this.logger.error(err1));
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

  onRtcAnswer(user: User, answer: string) {
    this.logger.message("hub answer received");

    if (user && user.id && this.isDecrypted(answer)) {
      let userRtcConnection = this.userData[user.id].connection;

      let then = () => {
        let decryptedAnswer = JSON.parse(decrypt(answer));
        this.logger.message("begin setRemoteDescription");
        userRtcConnection.setRemoteDescription(decryptedAnswer)
          .then(() => this.logger.message("end setRemoteDescription"))
          .catch(err2 => this.logger.error(err2));
      }

      if (!userRtcConnection) {
        userRtcConnection = this.createUserData(user);

        this.logger.message("begin setLocalDescription");
        userRtcConnection.setLocalDescription(this.currentOffer)
          .then(() => {
            this.logger.message("end setLocalDescription");
            then();
          })
          .catch(err => this.logger.error(err));
      } else {
        then();
      }
    }
  }

  onRtcOffer(user: User, offer: string) {
    this.logger.message("hub offer received");

    if (user && user.id && user.name && this.isDecrypted(offer)) {

      let userRtcConnection = this.userData[user.id].connection;
      if (!userRtcConnection) {
        userRtcConnection = this.createUserData(user);
      }

      let decryptedOffer = JSON.parse(decrypt(offer));
      this.logger.message("begin setRemoteDescription");
      userRtcConnection.setRemoteDescription(decryptedOffer)
        .then(() => {
          this.logger.message("end setRemoteDescription");
          this.sendRtcAnswer(userRtcConnection);
        })
        .catch(err => this.logger.error(err));
    }
  }

  sendRtcAnswer(userRtcConnection: RTCPeerConnection) {
    let answerOptions: RTCAnswerOptions = {
      voiceActivityDetection: false
    };

    this.logger.message("begin createAnswer");
    userRtcConnection.createAnswer(answerOptions)
      .then((answer) => {
        this.logger.message("end createAnswer, begin hub answer");
        let encryptedAnswer = JSON.stringify(answer);
        this.webrtcHub.answer(this.categoryId, this.user, encryptedAnswer)
          .then(() => this.logger.message("end hub answer"))
          .catch(err => this.logger.error(err));
      })
      .catch(err => this.logger.error(err));
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

          for (let userId in this.userData) {
            let userData = this.userData[userId];
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
