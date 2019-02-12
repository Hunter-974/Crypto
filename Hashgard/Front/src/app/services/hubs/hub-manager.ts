import { Injectable, Type } from "@angular/core";
import { BaseHub } from "./base-hub";
import { BaseSubscribeHub } from "./base-subscribe-hub";

@Injectable()
export class HubManager {

    private hubs: { [name: string]: BaseSubscribeHub } = {};
    
    public subscribeTo(hubType: new(type: string, id: number) => BaseSubscribeHub, 
        objectType: string, 
        objectId: number, 
        handler: (...args: any[]) => void) {

        let hub: BaseSubscribeHub = this.hubs[hubType.name];

        if (!hub) {
            hub = new hubType(objectType, objectId);
            this.hubs[hubType.name] = hub;
        }

        let then = () => hub.subscribe(objectType, objectId, handler);
        if (!hub.isConnected && !hub.isConnecting) {
            hub.start().subscribe(res => then);
        } else if (!hub.isConnected && hub.isConnecting) {
            hub.connected.subscribe(then);
        } else if (hub.isConnected && !hub.isConnecting) {
            then();
        }
    }

    public unsubscribeTo(hubType: new(type: string, id: number) => BaseSubscribeHub, 
        objectType: string, 
        objectId: number) {
            
        let hub: BaseSubscribeHub = this.hubs[hubType.name];

        if (hub && hub.isConnected) {
            hub.unsubscribe()
        }
    }

}

export class HubHandle {
    constructor(private hub: BaseSubscribeHub, private key: string) {
    }

    public destroy() {
        this.hub.off(key);
        if (!this.hub.hasAnyHandler) {
            this.hub.stop();
        }
    }
}
