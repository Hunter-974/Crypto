import { Reaction } from "src/app/models/reaction";
import { User } from "src/app/models/user";
import { Page } from "./page";
import { ReactionType } from "./reaction-type";

export class Comment {
  public id: number;
  public articleId: number;
  public parentId: number;
  public user: User;
  public children: Page<Comment>;
  public reactions: Reaction[];
  public reactionTypes: ReactionType[];
  public text: string;
  public versionDate: Date;

  public error: string;
  public isWriting: boolean;
}
