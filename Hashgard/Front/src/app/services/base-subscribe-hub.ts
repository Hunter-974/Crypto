import { BaseHub } from "./base-hub";
import { Observable } from "rxjs";

export abstract class BaseSubscribeHub extends BaseHub {

    constructor(path: string, private objectType: string, private objectId: number) {
        super(path);
    }

    public start() {
        return new Observable<any>(subscriber => {
            super.start().subscribe(
                () => {
                    this.invokeSubscribe().subscribe(
                        () => {
                            subscriber.next();
                            subscriber.complete();
                        },
                        err => {
                            subscriber.error(err);
                            subscriber.complete();
                        }
                    );
                },
                err => {
                    subscriber.error(err);
                    subscriber.complete();
                }
            );
        });
    }

    protected invokeSubscribe() {
        return new Observable<any>(subscriber => {
            console.log(`Subscribing to ${this.path} for ${this.objectType} ${this.objectId}`);
            this.hubConnection.invoke("Subscribe", {
                objectType: this.objectType,
                objectId: this.objectId,
                hubsToken: BaseHub.token
            }).then(() => {
                console.log(`Subscribed to ${this.path} for ${this.objectType} ${this.objectId}`)
                subscriber.next();
                subscriber.complete();
            }).catch(err => {
                console.log(`Subscribtion to ${this.path} for ${this.objectType} ${this.objectId} failed`)
                subscriber.error(err);
                subscriber.complete();
            })
        });
    }
}
