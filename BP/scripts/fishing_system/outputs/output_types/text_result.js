import { generateUUID16 } from "utils/utilities";
export class TextResult {
    constructor(message, fisher) {
        this.message = message;
        this.fisher = fisher;
        this.executed = false;
        this.id = generateUUID16();
    }
    reset() {
        return Promise.resolve();
    }
    run() {
        if (this.executed || !this.fisher.source)
            return;
        var _rawMessage = {
            rawtext: [
                {
                    text: this.fisher.source.nameTag + ": ",
                },
                {
                    translate: this.message,
                },
            ],
        };
        this.fisher.source.sendMessage(_rawMessage);
        this.markExecuted();
    }
    markExecuted() {
        this.executed = true;
    }
}
