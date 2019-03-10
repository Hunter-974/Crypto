import { Injectable, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user';
import { encrypt } from '../crypto/crypto.service';
import { RtcSignalData } from 'src/app/models/rtc-signal-data';
import { BaseHub } from '../base-hub';

@Injectable({
  providedIn: 'root'
})
export class WebrtcHub extends BaseHub {

  public userJoined: EventEmitter<RtcSignalData> = new EventEmitter();
  public welcomed: EventEmitter<RtcSignalData> = new EventEmitter();
  public offered: EventEmitter<RtcSignalData> = new EventEmitter();
  public answered: EventEmitter<RtcSignalData> = new EventEmitter();
  public iceCandidateReceived: EventEmitter<RtcSignalData> = new EventEmitter();

  public constructor() {
    super("webrtc");

    this.hubConnection.on("UserJoined", (user: User, cid: string) => 
      this.userJoined.emit(new RtcSignalData(null, user, cid)));

    this.hubConnection.on("Welcome", (user: User, cid: string) => 
      this.welcomed.emit(new RtcSignalData(null, user, cid)));

    this.hubConnection.on("Offer", (offer: string, user: User, cid: string) => 
      this.offered.emit(new RtcSignalData(offer, user, cid)));

    this.hubConnection.on("Answer", (answer: string, user: User, cid: string) =>
      this.answered.emit(new RtcSignalData(answer, user, cid)));

    this.hubConnection.on("IceCandidate", (iceCandidate: string, user: User, cid: string, direction: string) => 
      this.iceCandidateReceived.emit(new RtcSignalData(iceCandidate, user, cid, direction)));
  }

  public welcome(toCid: string) {
    return this.hubConnection.invoke("Welcome", this.userToken, toCid);
  }

  public offer(toCid: string, offer: string) {
    return this.hubConnection.invoke("Offer", this.userToken, toCid, encrypt(offer));
  }

  public answer(toCid: string, answer: string) {
    return this.hubConnection.invoke("Answer", this.userToken, toCid, encrypt(answer));
  }

  public iceCandidate(toCid: string, direction: string, iceCandidate: string) {
    return this.hubConnection.invoke("IceCandidate", this.userToken, toCid, direction, encrypt(iceCandidate));
  }
}
