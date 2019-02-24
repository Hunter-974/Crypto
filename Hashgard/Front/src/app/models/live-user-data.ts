import { User } from "./user";

export class LiveUserData {
    user: User;
    cid: string;
    in: LiveUserConnectionData;
    out: LiveUserConnectionData;

    constructor() {
        this.out = new LiveUserConnectionData();
        this.in = new LiveUserConnectionData();
    }
}

export class LiveUserConnectionData {
    connection: RTCPeerConnection;
    stream: MediaStream;
    isNegotiating: boolean;
    channel: RTCDataChannel;
    resetTimeoutHandle: any;
    heartbeatIntervalHandle: any;
}