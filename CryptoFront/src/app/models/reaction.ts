import { User } from "src/app/models/user";

export class Reaction {
    public id: number;
    public user: User;
    public reactionType: string;
}
