import { ParticleState } from "types/index";
import { TextResult, BothResult, DisabledResult, ParticleResult } from "./output_types/index";
import { clientConfiguration } from "fishing_system/configuration/client_configuration";
export class FishingResultBuilder {
    static create(config, fisher) {
        const keyName = Object.keys(clientConfiguration).find(key => clientConfiguration[key] === config);
        if (!this.isInParticleManager(keyName))
            throw new Error("No Particle Key exist / found");
        switch (config.defaultValue) {
            case 'TEXT':
                const textEvent = new TextResult(ParticleState[keyName].text, fisher);
                if (!this.executedTextEvents.has(textEvent)) {
                    this.executedTextEvents.add(textEvent);
                    return textEvent;
                }
                return new DisabledResult();
            case 'ICON':
                const iconEvent = new ParticleResult(ParticleState[keyName].particle, fisher);
                if (!this.executedUIEvents.has(iconEvent)) {
                    this.executedUIEvents.add(iconEvent);
                    return iconEvent;
                }
                return new DisabledResult();
            case 'BOTH':
                const bothEvent = new BothResult(ParticleState[keyName].text, ParticleState[keyName].particle, fisher);
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
        return (Object.getOwnPropertyNames(ParticleState).filter(prop => !(['length', 'name', 'prototype'].includes(prop)))).includes(key);
    }
}
FishingResultBuilder.executedTextEvents = new Set();
FishingResultBuilder.executedUIEvents = new Set();
