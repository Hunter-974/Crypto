import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HubConnectionBuilder, JsonHubProtocol, HubConnection } from '@aspnet/signalr';
import { User } from 'src/app/models/user';
import { encrypt } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class WebrtcHub {

  private hubConnection: HubConnection;

  public offered: EventEmitter<{ offer: string, user: User }> = new EventEmitter();
  public answered: EventEmitter<{ answer: string, user: User }> = new EventEmitter();
  public closed: EventEmitter<Error> = new EventEmitter();

  public constructor() {
    let signalrBaseUrl = environment.settings.signalrBaseUrl;
    this.hubConnection = new HubConnectionBuilder()
      .withHubProtocol(new JsonHubProtocol())
      .withUrl(`${signalrBaseUrl}/webrtc`)
      .build();

    this.hubConnection.onclose(err => this.closed.emit(err));
    this.hubConnection.on("Offer",
      (user: User, offer: string) => this.offered.emit({ offer: offer, user: user }));
    this.hubConnection.on("Answer",
      (user: User, answer: string) => this.answered.emit({ answer: answer, user: user }));
  }

  public start(): Promise<any> {
    return this.hubConnection.start();
  }

  public stop(): Promise<any> {
    return this.hubConnection.stop();
  }

  public listen(categoryId: number): Promise<any> {
    return this.hubConnection.invoke("Listen", categoryId);
  }

  public stopListening(categoryId: number): Promise<any> {
    return this.hubConnection.invoke("StopListening", categoryId);
  }

  public offer(categoryId: number, user: User, offer: string) {
    return this.hubConnection.invoke("Offer", categoryId, user, encrypt(offer));
  }

  public answer(categoryId: number, user: User, answer: string) {
    return this.hubConnection.invoke("Answer", categoryId, user, encrypt(answer));
  }
}
