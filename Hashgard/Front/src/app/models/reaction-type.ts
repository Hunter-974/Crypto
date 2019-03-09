import { BaseAuthService } from "../services/base-auth-service";

export class ReactionType {
    public id: number;
    public articleId: number;
    public commentId: number;
    public name: string;
    public reactionCount: number;
    public reactionUserIds: number[];
}
