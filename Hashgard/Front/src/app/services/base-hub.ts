import { HubConnection, HubConnectionBuilder, JsonHubProtocol } from "@aspnet/signalr";
import { environment } from "src/environments/environment";

export abstract class BaseHub {
    
    private static _token: string = null;

    public static get token(): string {
        return BaseHub._token;
    }

    private hubConnection: HubConnection;
    private registeredHandlers: string[] = [];

    protected handlers: {
        [key: string]: ((...args: any[]) => void) 
    } = {};

    constructor(protected path: string) {
        let baseUrl = environment.settings.signalrBaseUrl;
        this.hubConnection = new HubConnectionBuilder()
            .withHubProtocol(new JsonHubProtocol())
            .withUrl(`${baseUrl}/${path}`)
            .build();

        this.hubConnection.onclose((err) => this.connect());
    }

    public start() {        
        for (let key in this.handlers) {
            this.on(key, this.handlers[key]);
        }

        this.connect();
    }

    private connect() {
        console.log(`Connecting to hub ${this.path}`);
        this.hubConnection.start()
        .then(() => {
            console.log(`Connected to hub ${this.path}`);
            this.getTokenIfNecessary();
        })
        .catch(err => console.log(`Connection to hub ${this.path} failed`));
    }

    private getTokenIfNecessary() {
        if (!BaseHub.token) {
            console.log(`Getting app token for hub ${this.path}`);
            this.hubConnection.invoke<string>("GetToken")
                .then(token =>  {
                    BaseHub._token = token;
                    console.log(`Got token for hub ${this.path}`)
                })
                .catch(err => console.log(`Getting token for hub ${this.path} failed`));
        }
    }

    protected on(key: string, handler: (...args: any[]) => void) {
        this.hubConnection.on(key, handler);
        this.registeredHandlers.push(key);
    }

    public stop() {
        for(let handler of this.registeredHandlers) {
            this.hubConnection.off(handler);
        }
        this.registeredHandlers.splice(0);
        this.hubConnection.stop();
    }
}
