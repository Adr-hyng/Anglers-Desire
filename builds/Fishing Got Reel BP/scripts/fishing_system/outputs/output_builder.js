import { FishingOutputHandler } from "types/index";
import { TextResult, BothResult, DisabledResult, ParticleResult } from "./output_types/index";
export class FishingOutputBuilder {
    static create(config, fisher) {
        const keyName = Object.keys(fisher.clientConfiguration).find(key => fisher.clientConfiguration[key] === config);
        if (!this.isInParticleManager(keyName))
            throw new Error("No Particle Key exist / found");
        switch (config.defaultValue) {
            case 'TEXT':
                const textEvent = new TextResult(FishingOutputHandler[keyName].text, fisher);
                if (!this.executedTextEvents.has(textEvent)) {
                    this.executedTextEvents.add(textEvent);
                    return textEvent;
                }
                return new DisabledResult();
            case 'ICON':
                const iconEvent = new ParticleResult(FishingOutputHandler[keyName].particle, fisher);
                if (!this.executedUIEvents.has(iconEvent)) {
                    this.executedUIEvents.add(iconEvent);
                    return iconEvent;
                }
                return new DisabledResult();
            case 'BOTH':
                const bothEvent = new BothResult(FishingOutputHandler[keyName].text, FishingOutputHandler[keyName].particle, fisher);
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
    static isInParticleManager(key) {
        return (Object.getOwnPropertyNames(FishingOutputHandler).filter(prop => !(['length', 'name', 'prototype'].includes(prop)))).includes(key);
    }
}
FishingOutputBuilder.executedTextEvents = new Set();
FishingOutputBuilder.executedUIEvents = new Set();
