// https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebrtcHub } from 'src/app/services/webrtc/webrtc.hub';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../base-component';
import { User } from 'src/app/models/user';
import { decrypt, encrypt } from 'src/app/services/crypto/crypto.service';
import { faPlay, faPause, faVideo, faStop } from '@fortawesome/free-solid-svg-icons';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LiveUserData } from 'src/app/models/live-user-data';
import { RtcConfig } from 'src/app/models/rtc-config';
import { RtcSignalData } from 'src/app/models/rtc-signal-data';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent extends BaseComponent implements OnInit, OnDestroy {

  isHubReady: boolean;
  isNegociating: boolean;
  categoryId: number;
  category: Category;
  error: string;

  stream: MediaStream;
  userDataDict: {
    [userId: number]: LiveUserData
  } = {};

  get isSettingsReady(): boolean {
    return this.isLoggedIn && this.category && this.isDecrypted(this.category.name);
  }

  constructor(
    private webrtcHub: WebrtcHub,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    logger: LoggerService) {

    super(logger);
  }

  ngOnInit() {
    this.categoryId = this.route.snapshot.params["categoryId"];
    this.initHubEvents();
    this.categoryService.getCategory(this.categoryId).subscribe(
      res => this.category = res,
      err => this.logger.error(err)
    );
  }

  ngOnDestroy() {
    this.globalStop();
  }

  initHubEvents() {
    console.log("begin initHubEvents");
    
    this.webrtcHub.closed.subscribe(err => {
      this.isHubReady = false;
      if (err) {
        this.logger.error(err)
        this.startHub();
      }
    });

    this.webrtcHub.userJoined.subscribe(obj => this.onRtcUserJoin(obj));
    this.webrtcHub.welcomed.subscribe(obj => this.onRtcWelcome(obj));
    this.webrtcHub.offered.subscribe(obj => this.onRtcOffer(obj));
    this.webrtcHub.answered.subscribe(obj => this.onRtcAnswer(obj));
    this.webrtcHub.iceCandidateReceived.subscribe(obj => this.onRtcIceCandidate(obj));

    console.log("end initHubEvents");
  }

  globalStart() {
    if (this.isSettingsReady) {
      this.startHub();
    }
  }

  globalStop() {
    this.stopHub();
    for (let userId in this.userDataDict) {
      let userData = this.userDataDict[userId];
      if (userData && userData.connection) {
        try {
          userData.connection.close();
        } catch (err) {
          this.logger.error(err);
        }
      }
      delete this.userDataDict[userId];
    }
  }

  startStream(userData: LiveUserData) {
    let callback = (stream: MediaStream) => {
      this.logger.message("add tracks");
      for (let track of stream.getTracks()) {
        userData.connection.addTrack(track);
      }
    };

    this.startMediaIfNeeded(userData, callback);
  }

  

  stopStream(userData: LiveUserData) {

  }

  startMediaIfNeeded(userData: LiveUserData, 
    callback: (stream: MediaStream, userData: LiveUserData) => void) {

    if (this.isSettingsReady) {
      if (this.stream) {
        callback(this.stream, userData);
      }
      else {
        this.startMedia(stream => callback(stream, userData));
      }
    }
  }

  startMedia(callback: (stream: MediaStream) => void) {
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
        callback(stream);
      })
      .catch(err => this.logger.error(err));
  }

  startHub() {
    this.logger.message("begin start hub");
    
    this.webrtcHub.start()
      .then(() => {
        this.logger.message("end start hub");
        this.sendRtcListen();
      })
      .catch(err1 => this.logger.error(err1));
  }

  stopHub() {
    this.logger.message("begin hub stop");
    this.webrtcHub.stop()
    .then(() => {
      this.logger.message("end hub stop");
      this.isHubReady = false;
    })
    .catch(err => this.logger.error(err));
  }

  createUserData(user: User, cid: string) {
    let userData = this.userDataDict[user.id];

    if (!userData) {
      userData = new LiveUserData();
      userData.user = user;
      userData.cid = cid;
      this.userDataDict[user.id] = userData
      this.createConnection(userData);
    } else {
      userData.cid = cid;
    }

    return userData;
  }

  createConnection(userData: LiveUserData) {
    let connection = new RTCPeerConnection(new RtcConfig());
    userData.connection = connection;

    connection.onicecandidate = ev => {
      this.logger.message("received ice candidate");
      var iceCandidate = JSON.stringify(ev.candidate)
      this.webrtcHub.iceCandidate(userData.cid, iceCandidate)
        .then(() => this.logger.message("end send ice candidate"))
        .catch(err => this.logger.error(err));
    }

    connection.ontrack = ev => {
      this.logger.message("received track");
      if (ev.streams && ev.streams.length) {
        userData.stream = ev.streams[0];
      }

      let callback = (stream: MediaStream) => {
        this.logger.message("add tracks");
        for (let track of stream.getTracks()) {
          userData.connection.addTrack(track);
        }
      };
      this.startMediaIfNeeded(userData, callback);
    };

    connection.onnegotiationneeded = ev => {
      if (!this.isNegociating) {
        setTimeout(() => this.isNegociating = false, 15000);
        this.isNegociating = true;
        this.logger.message("negotiation needed");
        this.createOffer(userData);
      }
    };
  }

  createOffer(userData: LiveUserData) {
    let offerOptions: RTCOfferOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true, 
      voiceActivityDetection: false,
      iceRestart: false
    };

    this.logger.message("begin createOffer");
    userData.connection.createOffer(offerOptions)
      .then(offer => {
        this.logger.message("end createOffer");
        this.setLocalDescription(offer, userData, (description, userData) => this.sendRtcOffer(description, userData));
      })
      .catch(err => this.logger.error(err));
  }

  setLocalDescription(description: RTCSessionDescriptionInit, userData: LiveUserData, 
    callback: (description: RTCSessionDescriptionInit, userdata: LiveUserData) => void) {
    this.logger.message("begin set local description");
    userData.connection.setLocalDescription(description).then(() => {
      this.logger.message("end set local description");
      if (callback) callback(description, userData);
    })
    .catch(err => this.logger.error(err));
  }

  setRemoteDescription(description: RTCSessionDescriptionInit, userData: LiveUserData, 
    callback: (description: RTCSessionDescriptionInit, userdata: LiveUserData) => void) {
      
    this.logger.message("begin set remote description");
    userData.connection.setRemoteDescription(description).then(() => {
      this.logger.message("end set remote description");
      if (callback) callback(description, userData);
    })
    .catch(err => this.logger.error(err));
  }

  createAnswer(userData: LiveUserData) {
    let answerOptions: RTCAnswerOptions = {
      voiceActivityDetection: false
    };

    this.logger.message("begin createAnswer");
    userData.connection.createAnswer(answerOptions)
      .then((answer) => {
        this.logger.message("end createAnswer");
        this.setLocalDescription(answer, userData, 
          (answer, userData) => this.sendRtcAnswer(answer, userData));
      })
      .catch(err => this.logger.error(err));
  }

  sendRtcListen() {
    this.logger.message("begin send hub listen");
    this.webrtcHub.listen(this.categoryId)
      .then(() => {
        this.logger.message("end send hub listen");
        this.isHubReady = true;
      })
      .catch(err => this.logger.error(err));
  }

  sendRtcWelcome(userData: LiveUserData) {
    this.logger.message("begin send hub welcome");
    this.webrtcHub.welcome(userData.cid)
      .then(() => this.logger.message("end send hub welcome"))
      .catch(err => this.logger.error(err));
  }

  sendRtcOffer(offer: RTCSessionDescriptionInit, userData: LiveUserData) {
    let offerString = JSON.stringify(offer);
    this.logger.message("begin send hub offer");
    this.webrtcHub.offer(userData.cid, offerString)
      .then(() => this.logger.message("end send hub offer"))
      .catch(err => this.logger.error(err));
  }

  sendRtcAnswer(answer: RTCSessionDescriptionInit, userData: LiveUserData) {
    let answerString = JSON.stringify(answer);
    this.logger.message("begin send hub answer");
    this.webrtcHub.answer(userData.cid, answerString)
      .then(() => {
        this.logger.message("end send hub answer");
        this.isNegociating = false;
      })
      .catch(err => this.logger.error(err));
  }

  sendRtcIceCandidate(iceCandidate: RTCIceCandidate, userData: LiveUserData) {
    var iceCandidateString = JSON.stringify(iceCandidate);
    this.logger.message("begin send ice candidate");
    this.webrtcHub.iceCandidate(userData.cid, iceCandidateString)
      .then(() => this.logger.message("end send ice candidate"))
      .catch(err => this.logger.error(err));
  }

  onRtcUserJoin(obj: RtcSignalData) {
    this.logger.message("hub user joined");
    this.createUserData(obj.user, obj.cid);
    this.webrtcHub.welcome(obj.cid);
  }

  onRtcWelcome(obj: RtcSignalData) {
    this.logger.message("hub welcome received");
    this.createUserData(obj.user, obj.cid)
  }

  onRtcOffer(obj: RtcSignalData) {
    this.isNegociating = true;
    this.logger.message("hub offer received");

    let userData = this.userDataDict[obj.user.id];
    if (userData && this.isDecrypted(obj.data)) {

      let offer = JSON.parse(decrypt(obj.data));
      this.setRemoteDescription(offer, userData,
        (description, userData) => this.createAnswer(userData));
    }
  }

  onRtcAnswer(obj: RtcSignalData) {
    this.logger.message("hub answer received");

    let userData = this.userDataDict[obj.user.id];
    if (userData && this.isDecrypted(obj.data)) {

      let answer = JSON.parse(decrypt(obj.data));
      this.logger.message("begin set remote description")

      this.setRemoteDescription(answer, userData,
        (description, userData) => this.isNegociating = false);
    }
  }

  onRtcIceCandidate(obj: RtcSignalData) {
    this.logger.message("ice candidate received");
    if (this.isDecrypted(obj.data)) {

      let userRtcConnection: RTCPeerConnection;
      if (this.userDataDict[obj.user.id]) {
        
        userRtcConnection = this.userDataDict[obj.user.id].connection;
        let decryptedIceCandidate = JSON.parse(decrypt(obj.data));

        this.logger.message("begin add ice candidate");
        userRtcConnection.addIceCandidate(decryptedIceCandidate)
          .then(() => {
            this.logger.message("end add ice candidate");
          })
          .catch(err => this.logger.error(err));
      }
    }
  }
}
