import { FishingOutputHandler } from "types/index";
import { TextResult, BothResult, DisabledResult, ParticleResult } from "./output_types/index";
export class FishingOutputBuilder {
    static create(config, fisher) {
        console.warn("Active Events:", JSON.stringify(this.activeEventCount()));
        const playerId = fisher.source.id;
        const keyName = this.extractKeyName(fisher, config);
        if (!this.isInParticleManager(keyName)) {
            throw new Error("No Particle Key exist / found");
        }
        if (!this.playerOutputs.has(playerId)) {
            this.playerOutputs.set(playerId, {});
        }
        const events = this.playerOutputs.get(playerId);
        const eventKey = `${keyName}_${config.defaultValue}`;
        if (!events[eventKey]) {
            events[eventKey] = this.createEvent(keyName, config.defaultValue, fisher);
        }
        return events[eventKey];
    }
    static extractKeyName(fisher, config) {
        return Object.keys(fisher.clientConfiguration).find(key => fisher.clientConfiguration[key] === config) || "defaultKey";
    }
    static createEvent(keyName, type, fisher) {
        switch (type) {
            case 'TEXT':
                return new TextResult(FishingOutputHandler[keyName].text, fisher);
            case 'ICON':
                return new ParticleResult(FishingOutputHandler[keyName].particle, fisher);
            case 'BOTH':
                return new BothResult(FishingOutputHandler[keyName].text, FishingOutputHandler[keyName].particle, fisher);
            default:
                return new DisabledResult();
        }
    }
    static isInParticleManager(key) {
        return Object.getOwnPropertyNames(FishingOutputHandler).includes(key);
    }
    static activeEventCount() {
        let textCount = 0;
        let uiCount = 0;
        this.playerOutputs.forEach(events => {
            Object.values(events).forEach(event => {
                if (event instanceof TextResult || event instanceof BothResult) {
                    textCount++;
                }
                if (event instanceof ParticleResult || event instanceof BothResult) {
                    uiCount++;
                }
            });
        });
        return { text: textCount, ui: uiCount };
    }
}
FishingOutputBuilder.playerOutputs = new Map();
