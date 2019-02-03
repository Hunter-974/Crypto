import { BaseHub } from "../base-hub";
import { ReactionType } from "src/app/models/reaction-type";
import { EventEmitter } from "@angular/core";

export class ReactionHub extends BaseHub {

    constructor() {
        super("reaction");
        this.handlers = {
            "Changed": reactionType => this.changed.emit(reactionType)
        };
    }

    changed: EventEmitter<ReactionType> = new EventEmitter<ReactionType>();
}
