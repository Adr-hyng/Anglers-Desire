import { EntryContent } from "types";

export type ModifierResult = {
  LoTSModifier: number;
  deepnessModifier: number;
};

export type EntityLootResult = {
  GeneralLoots: EntryContent[],
  /**
   * Special Rain Aquatic Mobs to catch when it's raining.
   */
  SpecialRainLoots: EntryContent[],
  /**
   * Special Aquatic Mobs to catch when you have luminous hook.
   */
  LuminousLoots: EntryContent[]
}