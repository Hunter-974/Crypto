import { User } from "./user";

export class LiveUserData {
    user: User;
    cid: string;
    connection: RTCPeerConnection;
    stream: MediaStream;
    isNegotiating: boolean;
}
