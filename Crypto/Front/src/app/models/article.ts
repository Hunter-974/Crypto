import { User } from "src/app/models/user";
import { ReactionCount } from "src/app/models/reaction-count";
import { Reaction } from "./reaction";

export class Article {
    public id: number;
    public user: User;
    public comments: Comment[];
    public reactions: Reaction[];
    public reactionCounts: ReactionCount[];
    public text: string;
    public title: string;
}
