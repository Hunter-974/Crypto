import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HubConnectionBuilder, JsonHubProtocol, HubConnection } from '@aspnet/signalr';
import { User } from 'src/app/models/user';
import { encrypt } from '../crypto/crypto.service';
import { BaseAuthService } from '../base-auth-service';
import { RtcSignalData } from 'src/app/models/rtc-signal-data';

@Injectable({
  providedIn: 'root'
})
export class WebrtcHub {

  private hubConnection: HubConnection;

  private get userToken() {
    return BaseAuthService.token;
  }

  public userJoined: EventEmitter<RtcSignalData> = new EventEmitter();
  public welcomed: EventEmitter<RtcSignalData> = new EventEmitter();
  public offered: EventEmitter<RtcSignalData> = new EventEmitter();
  public answered: EventEmitter<RtcSignalData> = new EventEmitter();
  public iceCandidateReceived: EventEmitter<RtcSignalData> = new EventEmitter();
  public closed: EventEmitter<Error> = new EventEmitter();

  public constructor() {
    let signalrBaseUrl = environment.settings.signalrBaseUrl;
    this.hubConnection = new HubConnectionBuilder()
      .withHubProtocol(new JsonHubProtocol())
      .withUrl(`${signalrBaseUrl}/webrtc`)
      .build();

    this.hubConnection.onclose(err => this.closed.emit(err));


    this.hubConnection.on("UserJoined", (user: User, cid: string) => 
      this.userJoined.emit(new RtcSignalData(null, user, cid)));

    this.hubConnection.on("Welcome", (user: User, cid: string) => 
      this.welcomed.emit(new RtcSignalData(null, user, cid)));

    this.hubConnection.on("Offer", (offer: string, user: User, cid: string) => 
      this.offered.emit(new RtcSignalData(offer, user, cid)));

    this.hubConnection.on("Answer", (answer: string, user: User, cid: string) =>
      this.answered.emit(new RtcSignalData(answer, user, cid)));

    this.hubConnection.on("IceCandidate", (iceCandidate: string, user: User, cid: string) => 
      this.iceCandidateReceived.emit(new RtcSignalData(iceCandidate, user, cid)));
  }

  public start(): Promise<any> {
    return this.hubConnection.start();
  }

  public stop(): Promise<any> {
    return this.hubConnection.stop();
  }

  public listen(categoryId: number): Promise<any> {
    return this.hubConnection.invoke("Listen", this.userToken, categoryId);
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

  public iceCandidate(toCid: string, iceCandidate: string) {
    return this.hubConnection.invoke("IceCandidate", this.userToken, toCid, encrypt(iceCandidate));
  }
}
