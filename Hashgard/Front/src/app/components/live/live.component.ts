// https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebrtcHub } from 'src/app/services/webrtc/webrtc.hub';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../base-component';
import { User } from 'src/app/models/user';
import { decrypt, encrypt } from 'src/app/services/crypto/crypto.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { LiveUserData, LiveUserConnectionData } from 'src/app/models/live-user-data';
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

  private static readonly heartbeatInterval = 2500;
  private static readonly heartbeatCountTimeout = 10;

  isHubReady: boolean;
  categoryId: number;
  category: Category;
  error: string;

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

    this.webrtcHub.userJoined.subscribe(obj => this.onUserJoin(obj));
    this.webrtcHub.welcomed.subscribe(obj => this.onWelcome(obj));
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
    this.logger.message("begin global stop");

    for (let userId in this.userDataDict) {
      let userData = this.userDataDict[userId];
      this.stopStream(userData);
      delete this.userDataDict[userId];
    }
    this.logger.message("stopped remote streams");

    this.stopHub();

    this.logger.message("end global stop");
  }

  startStream(userData: LiveUserData) {
    if (this.isSettingsReady) {
    this.logger.message("begin start stream");

      let callback = (stream: MediaStream) => {
        this.logger.message("add tracks");
        for (let track of stream.getTracks()) {
          userData.out.stream = stream;
          userData.out.connection.addTrack(track, stream);
        }
      };

      this.createStreamIfNeeded(userData, callback);
      this.logger.message("end start stream");
    }
  }

  stopStream(userData: LiveUserData) {
    this.logger.message("begin stop stream");

    userData.out.stream = null;

    this.resetTimeout(userData.out);
    this.heartbeatInterval(userData.out, true);

    if (userData.out.channel) {
      try {
        userData.out.channel.close();
      } catch (err) {
        this.logger.error(err);
      }
    }

    if (userData.out.connection) {
      try {
        userData.out.connection.close();
      } catch (err) {
        this.logger.error(err);
      }
    }

    this.logger.message("end stop stream");
  }

  resetInConnection(userData: LiveUserData) {
    this.logger.message("begin close in connection");

    userData.in.stream = null;
    
    this.resetTimeout(userData.in);
    this.heartbeatInterval(userData.in, true);

    if (userData.in.channel) {
      try {
        userData.in.channel.close();
      } catch (err) {
        this.logger.error(err);
      }
    }

    if (userData.in.connection) {
      try {
        userData.in.connection.close();
      } catch (err) {
        this.logger.error(err);
      }
    }

    this.logger.message("end close in connection");

    this.createInConnection(userData);
  }

  createStreamIfNeeded(userData: LiveUserData, 
    callback: (stream: MediaStream, userData: LiveUserData) => void) {

    if (this.isSettingsReady) {
      if (userData.out.stream) {
        callback(userData.out.stream, userData);
      }
      else {
        this.createStream(stream => callback(stream, userData));
      }
    }
  }

  createStream(callback: (stream: MediaStream) => void) {
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
        callback(stream);
      })
      .catch(err => this.logger.error(err));
  }

  startHub() {
    this.logger.message("begin hub start");
    
    this.webrtcHub.start()
      .then(() => {
        this.logger.message("end hub start");
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

  createUserDataIfNeeded(user: User, cid: string) {
    let userData = this.userDataDict[user.id];

    if (!userData) {
      userData = new LiveUserData();
      userData.user = user;
      userData.cid = cid;
      this.userDataDict[user.id] = userData
    } else {
      userData.cid = cid;
      userData.user.name = user.name;
    }

    this.createInConnection(userData);
    this.createOutConnection(userData);

    return userData;
  }

  createInConnection(userData: LiveUserData) {
    this.logger.message("creating new in connection");

    let connection = new RTCPeerConnection(new RtcConfig());
    userData.in.connection = connection;

    connection.onicecandidate = ev => {
      let direction = "in";
      this.logger.message("received ice candidate " + direction);
      this.sendRtcIceCandidate(ev.candidate, userData, direction);
    }

    connection.ontrack = ev => {
      this.logger.message("received track");
      if (ev.streams && ev.streams.length) {
        userData.in.stream = ev.streams[0];
      }
    };

    connection.onconnectionstatechange = ev => {
      let state = userData.in.connection.connectionState;
      this.logger.message("in connection state changed to " + state);
      if (state == 'disconnected' || state == 'closed' || state == 'failed') {
        this.createInConnection(userData);
      }
    };

    connection.ondatachannel = ev => {
      this.logger.message("data channel received");
      if (ev.channel.label == "status") {
        userData.in.channel = ev.channel;
        this.initStatusDataChannelEvents(userData.in, 
          () => this.resetInConnection(userData));
      }
    };
  }

  createOutConnection(userData: LiveUserData) {
    this.logger.message("creating new out connection");

    let connection = new RTCPeerConnection(new RtcConfig());
    userData.out.connection = connection;

    connection.onicecandidate = ev => {
      let direction = "out";
      this.logger.message("received ice candidate " + direction);
      this.sendRtcIceCandidate(ev.candidate, userData, direction);
    }

    connection.onnegotiationneeded = ev => {
      if (!userData.out.isNegotiating) {
        userData.out.isNegotiating = true;
        this.logger.message("negotiation needed");
        this.createOffer(userData);
      }
    };

    connection.onconnectionstatechange = ev => {
      let state = userData.out.connection.connectionState;
      this.logger.message("in connection state changed to " + state);
      if (state == 'disconnected' || state == 'closed' || state == 'failed') {
        this.createOutConnection(userData);
      }
    };

    this.createStatusDataChannel(userData);
  }

  createStatusDataChannel(userData: LiveUserData) {
    let options: RTCDataChannelInit = {}
    userData.out.channel = userData.out.connection.createDataChannel("status", options);
    this.initStatusDataChannelEvents(userData.out,
      () => this.stopStream(userData));
  }

  initStatusDataChannelEvents(connectionData: LiveUserConnectionData,
    resetCallback: () => void) {

    let channel = connectionData.channel;

    channel.onopen = ev => {
      this.logger.message("status channel opened");
      this.resetTimeout(connectionData, resetCallback);
      this.heartbeatInterval(connectionData, false);
    }

    channel.onclose = ev => {
      this.logger.message("status channel closed");
      resetCallback();
    }

    channel.onerror = ev => {
      this.logger.error(ev.error);
      resetCallback();
    }

    channel.onmessage = ev => {
      this.logger.message("status channel message");
      this.onRtcStatusChannelMessage(ev.data, connectionData, resetCallback);
    }
  }

  sendStatusChannelMessage(data: string, connectionData: LiveUserConnectionData) {
    this.logger.message("sending on status channel : " + data);
    connectionData.channel.send(data);
  }

  onRtcStatusChannelMessage(data: string, connectionData: LiveUserConnectionData,
    resetCallback: () => void) {
    
    if (data == "heartbeat") {
      this.resetTimeout(connectionData, resetCallback)
    }
  }

  resetTimeout(connectionData: LiveUserConnectionData, resetCallback: () => void = null) {
    if (connectionData.resetTimeoutHandle) {
      clearTimeout(connectionData.resetTimeoutHandle);
      connectionData.resetTimeoutHandle = null;
    }
    if (resetCallback) {
      connectionData.resetTimeoutHandle = setTimeout(() => {
        this.logger.message("timed out");
        resetCallback();
      }, 25000);
    }
  }

  heartbeatInterval(connectionData: LiveUserConnectionData, clear: boolean) {
    if (clear && connectionData.heartbeatIntervalHandle) {
      clearInterval(connectionData.heartbeatIntervalHandle);
      connectionData.heartbeatIntervalHandle = null;
    }
    if (!clear) {
      connectionData.heartbeatIntervalHandle = setInterval(() => {
        this.sendStatusChannelMessage("heartbeat", connectionData);
      }, LiveComponent.heartbeatInterval);
    } 
  }

  createOffer(userData: LiveUserData) {
    let offerOptions: RTCOfferOptions = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true, 
      voiceActivityDetection: false,
      iceRestart: false
    };

    this.logger.message("begin createOffer");
    userData.out.connection.createOffer(offerOptions)
      .then(offer => {
        this.logger.message("end createOffer");
        this.setLocalDescription(offer, userData.out,
          () => this.sendRtcOffer(offer, userData));
      })
      .catch(err => this.logger.error(err));
  }

  setLocalDescription(
    description: RTCSessionDescriptionInit,
    connectionData: LiveUserConnectionData,
    callback: () => void) {

    this.logger.message("begin set local description");
    connectionData.connection.setLocalDescription(description).then(() => {
      this.logger.message("end set local description");
      if (callback) callback();
    })
    .catch(err => this.logger.error(err));
  }

  setRemoteDescription(
    description: RTCSessionDescriptionInit,
    connectionData: LiveUserConnectionData,
    callback: () => void) {

    this.logger.message("begin set remote description");
    connectionData.connection.setRemoteDescription(description).then(() => {
      this.logger.message("end set remote description");
      if (callback) callback();
    })
    .catch(err => this.logger.error(err));
  }

  createAnswer(userData: LiveUserData) {
    let answerOptions: RTCAnswerOptions = {
      voiceActivityDetection: false
    };

    this.logger.message("begin createAnswer");
    userData.in.connection.createAnswer(answerOptions)
      .then((answer) => {
        this.logger.message("end createAnswer");
        this.setLocalDescription(answer, userData.in, 
          () => this.sendRtcAnswer(answer, userData));
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
        userData.in.isNegotiating = false;
      })
      .catch(err => this.logger.error(err));
  }

  sendRtcIceCandidate(iceCandidate: RTCIceCandidate, userData: LiveUserData, direction: string) {
    var iceCandidateString = JSON.stringify(iceCandidate);
    this.logger.message("begin send ice candidate " + direction);
    this.webrtcHub.iceCandidate(userData.cid, direction, iceCandidateString)
      .then(() => this.logger.message("end send ice candidate " + direction))
      .catch(err => this.logger.error(err));
  }

  onUserJoin(obj: RtcSignalData) {
    this.logger.message("hub user joined");
    this.createUserDataIfNeeded(obj.user, obj.cid);
    this.webrtcHub.welcome(obj.cid);
  }

  onWelcome(obj: RtcSignalData) {
    this.logger.message("hub welcome received");
    this.createUserDataIfNeeded(obj.user, obj.cid)
  }

  onRtcOffer(obj: RtcSignalData) {
    let userData = this.userDataDict[obj.user.id];
    if (userData && !userData.in.isNegotiating) {
      this.logger.message("hub offer received");
      if (this.isDecrypted(obj.data)) {
        userData.in.isNegotiating = true;
        let offer = JSON.parse(decrypt(obj.data));
        this.setRemoteDescription(offer, userData.in,
          () => this.createAnswer(userData));
      }
    }
  }

  onRtcAnswer(obj: RtcSignalData) {
    this.logger.message("hub answer received");
    let userData = this.userDataDict[obj.user.id];
    if (userData && this.isDecrypted(obj.data)) {
      let answer = JSON.parse(decrypt(obj.data));
      this.logger.message("begin set remote description")
      this.setRemoteDescription(answer, userData.out,
        () => userData.out.isNegotiating = false);
    }
  }

  onRtcIceCandidate(obj: RtcSignalData) {
    if (this.isDecrypted(obj.data)) {

      if (this.userDataDict[obj.user.id]) {
        this.logger.message("hub ice candidate received " + obj.direction);
        let userData = this.userDataDict[obj.user.id];

        let userRtcConnection: RTCPeerConnection;
        if (obj.direction == "in") {
          userRtcConnection = userData.in.connection;
        } else if (obj.direction == "out") {
          userRtcConnection = userData.out.connection;
        } else {
          throw Error("direction must be 'in' or 'out'");
        }

        let decryptedIceCandidate = JSON.parse(decrypt(obj.data));
        this.logger.message("begin add ice candidate " + obj.direction);
        userRtcConnection.addIceCandidate(decryptedIceCandidate)
          .then(() => this.logger.message("end add ice candidate " + obj.direction))
          .catch(err => this.logger.error(err));
      }
    }
  }
}
