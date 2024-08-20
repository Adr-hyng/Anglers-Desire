import { FishingOutputHandler } from "types/index";
import { Fisher} from "fishing_system/entities/fisher";
import { TextResult, BothResult, DisabledResult, ParticleResult } from "./output_types/index";
import { IFishingOutput } from "./IFishingOutput";
import { FormBuilder } from "utils/form_builder";

export class FishingOutputBuilder {
  private static executedTextEvents: Set<IFishingOutput> = new Set();
  private static executedUIEvents: Set<IFishingOutput> = new Set();

  // This creates or updates
  // This is use in initialized, upon client configuration updates, and upon reset.
  static create(
    config: FormBuilder<any>,
    fisher: Fisher
  ): IFishingOutput {
    const keyName = Object.keys(fisher.clientConfiguration).find(key => fisher.clientConfiguration[key] === config);
    if(!this.isInParticleManager(keyName)) throw new Error("No Particle Key exist / found");
    switch (config.defaultValue) {
      case 'TEXT':
        const textEvent = new TextResult(FishingOutputHandler[keyName].text, fisher);
        if (!this.executedTextEvents.has(textEvent)) {
          this.executedTextEvents.add(textEvent);
          return textEvent;
        }
        return new DisabledResult(); // Return OffEvent if already executed
      case 'ICON':
        const iconEvent = new ParticleResult(FishingOutputHandler[keyName].particle, fisher);
        if (!this.executedUIEvents.has(iconEvent)) {
          this.executedUIEvents.add(iconEvent);
          return iconEvent;
        }
        return new DisabledResult(); // Return OffEvent if already executed
      case 'BOTH':
        const bothEvent = new BothResult(FishingOutputHandler[keyName].text, FishingOutputHandler[keyName].particle, fisher);
        if (!this.executedTextEvents.has(bothEvent) || !this.executedUIEvents.has(bothEvent)) {
          this.executedTextEvents.add(bothEvent);
          this.executedUIEvents.add(bothEvent);
          return bothEvent;
        }
        return new DisabledResult(); // Return OffEvent if both already executed
      default:
        return new DisabledResult();
    }
  }

  private static isInParticleManager(key: string) {
    return (Object.getOwnPropertyNames(FishingOutputHandler).filter(prop => !(['length', 'name', 'prototype'].includes(prop)))).includes(key);
  }
}