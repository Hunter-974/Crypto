import { BaseHub } from "../base-hub";
import { Injectable, EventEmitter } from "@angular/core";
import { User } from "../../models/user";
import { ChatMessageView } from "../../models/chat-message-view";
import { ChatMessage } from "../../models/chat-message";

@Injectable({
    providedIn: 'root'
})
export class ChatHub extends BaseHub {

    public userJoined: EventEmitter<User> = new EventEmitter();
    public newMessage: EventEmitter<ChatMessage> = new EventEmitter();
    public messageViewed: EventEmitter<ChatMessageView> = new EventEmitter();

    constructor() {
        super("chat");

        this.hubConnection.on("UserJoined", (user: User) => 
            this.userJoined.emit(user));

        this.hubConnection.on("NewMessage", (message: ChatMessage) => 
            this.newMessage.emit(message));

        this.hubConnection.on("MessageViewed", (view: ChatMessageView) =>
            this.messageViewed.emit(view));
    }

    public postMessage(categoryId: number, text: string) {
        this.hubConnection.invoke("PostMessage", this.userToken, categoryId, text);
    }

    public postEvent(categoryId: number, eventType: string) {
        this.hubConnection.invoke("PostEvent", this.userToken, categoryId, eventType);
    }

    public viewMessage(categoryId: number, messageId: number) {
        this.hubConnection.invoke("ViewMessage", this.userToken, categoryId, messageId);
    }
}
