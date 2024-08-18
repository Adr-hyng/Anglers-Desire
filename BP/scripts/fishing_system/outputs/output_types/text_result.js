import { generateUUID16 } from "utils/utilities";
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
    }
}
