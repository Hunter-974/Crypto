import { User } from "./user";

export class RtcSignalData {
    data: string;
    user: User;
    cid: string;
    direction?: string;

    constructor(data: string, user: User, cid: string, direction?: string) {
        this.data = data;
        this.user = user;
        this.cid = cid;
        
        if (direction) {
            this.direction = direction;
        }
    }
}
