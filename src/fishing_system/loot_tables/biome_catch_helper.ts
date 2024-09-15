import { world } from "@minecraft/server";
import { EntryContent } from "types";
import { EntityLootResult } from "./biomes/types";
import { Fisher } from "fishing_system/entities/fisher";

export class ParentCatchLoot {
  protected static fisher: Fisher;
  protected static RAIN_INCREASED_CHANCE: number = 150;

  protected static LuminousLoots: EntryContent[];
  protected static SpecialRainLoots: EntryContent[];
  protected static GeneralLoots: EntryContent[];

  protected static FilteredEntityEntry(): EntryContent[] {
    const rainChanceModifier = this.RAIN_INCREASED_CHANCE / 100;
    const isRaining = this.fisher.currentWeather > 0;

    // Calculate the total weight of GeneralLoots
    const totalGeneralWeight = this.GeneralLoots.reduce((sum, loot) => sum + loot.weight, 0);

    // Determine the additional weight added by special loots
    const additionalLoots = [
      ...(this.fisher.fishingRod.upgrade.has("Luminous") ? this.LuminousLoots : []),
      ...(isRaining ? this.SpecialRainLoots : [])
    ];

    const additionalWeight = additionalLoots.reduce((sum, loot) => sum + loot.weight, 0);

    // Adjust GeneralLoots weights if there are additional loots
    if (additionalWeight > 0) {
      const weightReductionFactor = (totalGeneralWeight - additionalWeight) / totalGeneralWeight;

      for (let loot of this.GeneralLoots) {
        loot.weight *= weightReductionFactor;
      }
    }

    // Combine all loots
    const BlendedLoots: EntryContent[] = [
      ...additionalLoots,
      ...this.GeneralLoots
    ];

    // Increase weights when raining
    if (isRaining) {
      for (let loot of BlendedLoots) {
        loot.weight *= rainChanceModifier;
      }
    }

    return BlendedLoots;
  }

  protected static initializeAttributes(fisher: Fisher, RAIN_INCREASE: number, entityLoots: EntityLootResult) {
    this.GeneralLoots = entityLoots.GeneralLoots;
    this.SpecialRainLoots = entityLoots.SpecialRainLoots;
    this.LuminousLoots = entityLoots.LuminousLoots;
    this.RAIN_INCREASED_CHANCE = RAIN_INCREASE;
    this.fisher = fisher;
  }
}