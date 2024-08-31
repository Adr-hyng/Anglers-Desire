import { EntryContent } from "types";

export type ModifierResult = {
  LoTSModifier: number;
  deepnessModifier: number;
};

export type EntityLootResult = {
  GeneralLoots: EntryContent[],
  SpecialRainLoots: EntryContent[],
  LuminousLoots: EntryContent[],
}