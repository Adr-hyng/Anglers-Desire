import { generateUUID16, SendMessageTo } from "utils/utilities";
export class TextResult {
    constructor(message, fisher) {
        this.message = message;
        this.fisher = fisher;
        this.id = generateUUID16();
    }
    reset() {
        return Promise.resolve();
    }
    run() {
        if (!this.fisher.source)
            return;
        SendMessageTo(this.fisher.source, {
            rawtext: [
                {
                    translate: this.message,
                    with: [this.fisher.source.name]
                }
            ]
        });
    }
}
