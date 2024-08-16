import { ParticleState } from "types/index";
import { Fisher } from "fishing_system/entities/fisher";
import { TextResult, BothResult, DisabledResult, ParticleResult } from "./output_types/index";
import { IFishingOutput } from "./fishing_output_indicator";
import { clientConfiguration, FormBuilder, ParticleStateOptions } from "fishing_system/configuration/client_configuration";

export class FishingResultBuilder {
  private static executedTextEvents: Set<IFishingOutput> = new Set(); // Internal accessible only within the same file
  private static executedUIEvents: Set<IFishingOutput> = new Set();

  static create(
    config: FormBuilder<any>,
    fisher?: Fisher
  ): IFishingOutput {
    const keyName = Object.keys(clientConfiguration).find(key => clientConfiguration[key] === config);
    if(!this.isInParticleManager(keyName)) throw new Error("No Particle Key exist / found");
    switch (config.defaultValue) {
      case 'TEXT':
        const textEvent = new TextResult(ParticleState[keyName].text, fisher);
        if (!this.executedTextEvents.has(textEvent)) {
          this.executedTextEvents.add(textEvent);
          return textEvent;
        }
        return new DisabledResult(); // Return OffEvent if already executed
      case 'ICON':
        const iconEvent = new ParticleResult(ParticleState[keyName].particle, fisher);
        if (!this.executedUIEvents.has(iconEvent)) {
          this.executedUIEvents.add(iconEvent);
          return iconEvent;
        }
        return new DisabledResult(); // Return OffEvent if already executed
      case 'BOTH':
        const bothEvent = new BothResult(ParticleState[keyName].text, ParticleState[keyName].particle, fisher);
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
    return (Object.getOwnPropertyNames(ParticleState).filter(prop => !(['length', 'name', 'prototype'].includes(prop)))).includes(key);
  }
}