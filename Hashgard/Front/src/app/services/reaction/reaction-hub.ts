import { ReactionType } from "src/app/models/reaction-type";
import { EventEmitter } from "@angular/core";
import { BaseSubscribeHub } from "../base-subscribe-hub";

export class ReactionHub extends BaseSubscribeHub {

    constructor(objectType: string, objectId: number) {
        super("reaction", objectType, objectId);
        this.handlers = {
            "Changed": reactionType => this.changed.emit(reactionType)
        };
    }

    changed: EventEmitter<ReactionType> = new EventEmitter<ReactionType>();
}
