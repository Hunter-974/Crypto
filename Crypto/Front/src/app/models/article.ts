import { User } from "src/app/models/user";
import { Reaction } from "./reaction";
import { Comment } from "./comment";
import { Page } from "./page";
import { ReactionType } from "./reaction-type";

export class Article {
  public id: number;
  public user: User;
  public comments: Page<Comment>;
  public reactions: Reaction[];
  public reactionTypes: ReactionType[];
  public text: string;
  public title: string;
  public versionDate: Date;
}
