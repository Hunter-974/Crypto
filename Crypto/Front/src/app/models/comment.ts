import { ReactionCount } from "./reaction-count";
import { Reaction } from "src/app/models/reaction";
import { User } from "src/app/models/user";
import { Page } from "./page";

export class Comment {
  public id: number;
  public parentId: number;
  public user: User;
  public children: Page<Comment>;
  public reactions: Reaction[];
  public reactionCounts: ReactionCount[];
  public text: string;
  public versionDate: Date;

  public newCommentText: string;
  public error: string;
  public isWriting: boolean;
}
