import { User } from "./user";

export class RtcSignalData {
    data: string;
    user: User;
    cid: string;

    constructor(data: string, user: User, cid: string) {
        this.data = data;
        this.user = user;
        this.cid = cid;
    }
}
