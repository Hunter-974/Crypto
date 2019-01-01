import { ReactionCount } from "./reaction-count";
import { Reaction } from "src/app/models/reaction";
import { User } from "src/app/models/user";

export class Comment {
    public user: User;
    public children: Comment[];
    public reactions: Reaction[];
    public reactionCounts: ReactionCount[];
    public text: string;
}
