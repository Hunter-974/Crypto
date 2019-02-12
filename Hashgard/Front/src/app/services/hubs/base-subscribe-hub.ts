import { BaseHub } from "./base-hub";
import { Observable } from "rxjs";

export abstract class BaseSubscribeHub extends BaseHub {

    private externalHandlers

    constructor(path: string) {
        super(path);
    }

    public start() {
        return new Observable<any>(subscriber => {
            super.start().subscribe(
                () => {
                    subscriber.next();
                    subscriber.complete();
                },
                err => {
                    subscriber.error(err);
                    subscriber.complete();
                }
            );
        });
    }

    public subscribe(objectType: string, objectId: string) {
        return new Observable<any>(subscriber => {
            console.log(`Subscribing to ${this.path} for ${objectType} ${objectId}`);
            this.hubConnection.invoke("Subscribe", {
                objectType: objectType,
                objectId: objectId,
                hubsToken: BaseHub.token
            }).then(() => {
                console.log(`Subscribed to ${this.path} for ${objectType} ${objectId}`)
                subscriber.next();
                subscriber.complete();
            }).catch(err => {
                console.log(`Subscribtion to ${this.path} for ${objectType} ${objectId} failed`)
                subscriber.error(err);
                subscriber.complete();
            })
        });
    }

    public unsubscribe(objectType: string, objectId: string) {
        return new Observable<any>(subscriber => {
            console.log(`Unsubscribing to ${this.path} for ${objectType} ${objectId}`);
            this.hubConnection.invoke("Unsubscribe", {
                objectType: objectType,
                objectId: objectId,
                hubsToken: BaseHub.token
            }).then(() => {
                console.log(`Unsubscribed to ${this.path} for ${objectType} ${objectId}`)
                subscriber.next();
                subscriber.complete();
            }).catch(err => {
                console.log(`Unsubscribtion to ${this.path} for ${objectType} ${objectId} failed`)
                subscriber.error(err);
                subscriber.complete();
            })
        });
    }
}
