import { User } from "src/app/models/user";
import { ReactionType } from "./reaction-type";

export class Reaction {
    public id: number;
    public user: User;
    public reactionType: ReactionType;
}
