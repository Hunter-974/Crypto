import { HubConnection, HubConnectionBuilder, JsonHubProtocol } from "@aspnet/signalr";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { BaseAuthService } from "./base-auth-service";
import { EventEmitter } from "@angular/core";

export abstract class BaseHub {
    
    protected hubConnection: HubConnection;
    
    public closed: EventEmitter<Error> = new EventEmitter();

    protected get userToken() {
        return BaseAuthService.token;
    }

    public constructor(path: string) {
        let signalrBaseUrl = environment.settings.signalrBaseUrl;
        this.hubConnection = new HubConnectionBuilder()
          .withHubProtocol(new JsonHubProtocol())
          .withUrl(`${signalrBaseUrl}/${path}`)
          .build();

        this.hubConnection.onclose(err => this.closed.emit(err));
    }

    public start(): Promise<any> {
        return this.hubConnection.start();
    }

    public stop(): Promise<any> {
        return this.hubConnection.stop();
    }

    public listen(entityId: number): Promise<any> {
      return this.hubConnection.invoke("Listen", this.userToken, entityId);
    }
}
