import { User } from "./user";
import { ChatMessageView } from "./chat-message-view";

export class ChatMessage {
    id: number;
    user: User;
    views: ChatMessageView[];
    text: string;
    eventType: string;
}