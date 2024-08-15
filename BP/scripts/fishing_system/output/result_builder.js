import { TextResult, BothResult, DisabledResult, ParticleResult } from "./output_types/index";
export class FishingResultBuilder {
    static createActionResult(type, message, particleState, fisher) {
        switch (type) {
            case 'TEXT':
                const textEvent = new TextResult(message, fisher);
                if (!this.executedTextEvents.has(textEvent)) {
                    this.executedTextEvents.add(textEvent);
                    return textEvent;
                }
                return new DisabledResult();
            case 'ICON':
                const iconEvent = new ParticleResult(particleState, fisher);
                if (!this.executedUIEvents.has(iconEvent)) {
                    this.executedUIEvents.add(iconEvent);
                    return iconEvent;
                }
                return new DisabledResult();
            case 'BOTH':
                const bothEvent = new BothResult(message, particleState, fisher);
                if (!this.executedTextEvents.has(bothEvent) || !this.executedUIEvents.has(bothEvent)) {
                    this.executedTextEvents.add(bothEvent);
                    this.executedUIEvents.add(bothEvent);
                    return bothEvent;
                }
                return new DisabledResult();
            default:
                return new DisabledResult();
        }
    }
}
FishingResultBuilder.executedTextEvents = new Set();
FishingResultBuilder.executedUIEvents = new Set();
