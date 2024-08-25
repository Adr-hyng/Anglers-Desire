import { FishingOutputHandler } from "types/index";
import { Fisher} from "fishing_system/entities/fisher";
import { TextResult, BothResult, DisabledResult, ParticleResult } from "./output_types/index";
import { IFishingOutput } from "./IFishingOutput";
import { FormBuilder } from "utils/form_builder";

export class FishingOutputBuilder {
  private static playerOutputs: Map<string, { [key: string]: IFishingOutput }> = new Map();
  static create(
    config: FormBuilder<any>,
    fisher: Fisher
  ): IFishingOutput {
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

  private static extractKeyName(fisher: Fisher, config: FormBuilder<any>): string {
    return Object.keys(fisher.clientConfiguration).find(key => fisher.clientConfiguration[key] === config) || "defaultKey";
  }

  private static createEvent(keyName: string, type: string, fisher: Fisher): IFishingOutput {
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

  private static isInParticleManager(key: string): boolean {
    return Object.getOwnPropertyNames(FishingOutputHandler).filter(prop => !(['length', 'name', 'prototype'].includes(prop))).includes(key);
  }

  private static activeEventCount(): { text: number; ui: number } {
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
