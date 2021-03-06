import { HubConnection, HubConnectionBuilder, JsonHubProtocol } from "@aspnet/signalr";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";

export abstract class BaseHub {
    
    private static _token: string = null;
    private registeredHandlers: string[] = [];

    protected hubConnection: HubConnection;
    protected handlers: {
        [key: string]: ((...args: any[]) => void) 
    } = {};

    public static get token(): string {
        return BaseHub._token;
    }


    constructor(protected path: string) {
        let baseUrl = environment.settings.signalrBaseUrl;
        this.hubConnection = new HubConnectionBuilder()
            .withHubProtocol(new JsonHubProtocol())
            .withUrl(`${baseUrl}/${path}`)
            .build();

        this.hubConnection.onclose((err) => this.connect());
    }

    public start() {
        return new Observable<any>(subscriber => {

            for (let key in this.handlers) {
                this.on(key, this.handlers[key]);
            }

            this.connect().subscribe(
                res => {
                    subscriber.next(res);
                    subscriber.complete();
                },
                err => {
                    subscriber.error(err);
                    subscriber.complete();
                }
            );

        });
    }

    private connect() {
        return new Observable<any>(subscriber => {

            console.log(`Connecting to hub ${this.path}`);
            this.hubConnection.start()
            .then(() => {
                console.log(`Connected to hub ${this.path}`);
                this.syncToken().subscribe(
                    res => {
                        subscriber.next(res);
                        subscriber.complete();
                    }, err =>{
                        subscriber.error(err);
                        subscriber.complete();
                    }
                );                
            })
            .catch(err => {
                console.log(`Connection to hub ${this.path} failed`);
                subscriber.error(err);
                subscriber.complete();
            });

        });
    }

    private syncToken() {
        return new Observable<any>(subscriber => {

            console.log(`Getting app token for hub ${this.path}`);
            this.hubConnection.invoke<string>("SyncToken", BaseHub.token)
                .then(token =>  {
                    BaseHub._token = token;
                    console.log(`Got token for hub ${this.path}`)

                    subscriber.next();
                    subscriber.complete();
                })
                .catch(err => {
                    console.log(`Getting token for hub ${this.path} failed`);

                    subscriber.error(err);
                    subscriber.complete();
                });

        });
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
