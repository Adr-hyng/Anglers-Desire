import { ActionResultType, ParticleState } from "types/index";
import { Fisher } from "fishing_system/entities/fisher";
import { TextResult, BothResult, DisabledResult, ParticleResult } from "./output_types/index";
import { IFishingOutput } from "./fishing_output_indicator";

export class FishingResultBuilder {
  private static executedTextEvents: Set<IFishingOutput> = new Set(); // Internal accessible only within the same file
  private static executedUIEvents: Set<IFishingOutput> = new Set();

  /**
   * @param type Type of Action Result to execute or trigger.
   * @param message When TextEvent is selected, this will be the message to show.
   * @param particleState What Particle State to display
   * @param fisher the fisher instance who just triggered the event.
   * @returns 
   */
  static createActionResult(
    type: ActionResultType,
    message?: string,
    particleState?: ParticleState,
    fisher?: Fisher
  ): IFishingOutput {
    switch (type) {
      case 'TEXT':
        const textEvent = new TextResult(message, fisher);
        if (!this.executedTextEvents.has(textEvent)) {
          this.executedTextEvents.add(textEvent);
          return textEvent;
        }
        return new DisabledResult(); // Return OffEvent if already executed
      case 'ICON':
        const iconEvent = new ParticleResult(particleState, fisher);
        if (!this.executedUIEvents.has(iconEvent)) {
          this.executedUIEvents.add(iconEvent);
          return iconEvent;
        }
        return new DisabledResult(); // Return OffEvent if already executed
      case 'BOTH':
        const bothEvent = new BothResult(message, particleState, fisher);
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
}