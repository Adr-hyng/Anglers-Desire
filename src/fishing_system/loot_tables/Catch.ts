import { world } from "@minecraft/server";
import { HookUpgrades } from "fishing_system/upgrades/upgrades";
import { EntryContent } from "types";
import { EntityLootResult } from "./biomes/types";

export class Catch {
  protected static upgrade: HookUpgrades;
  protected static RAIN_INCREASED_CHANCE: number = 150;

  protected static LuminousLoots: EntryContent[];
  protected static SpecialRainLoots: EntryContent[];
  protected static GeneralLoots: EntryContent[];

  protected static FilteredEntityEntry(): EntryContent[] {
    const rainChanceModifier = this.RAIN_INCREASED_CHANCE / 100;
    const isRaining = world.IsRaining;

    // Calculate the total weight of GeneralLoots
    const totalGeneralWeight = this.GeneralLoots.reduce((sum, loot) => sum + loot.weight, 0);

    // Determine the additional weight added by special loots
    const additionalLoots = [
      ...(this.upgrade.has("Luminous") ? this.LuminousLoots : []),
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

  protected static initializeAttributes(upgrade: HookUpgrades, RAIN_INCREASE: number, entityLoots: EntityLootResult) {
    this.GeneralLoots = entityLoots.GeneralLoots;
    this.SpecialRainLoots = entityLoots.SpecialRainLoots;
    this.LuminousLoots = entityLoots.LuminousLoots;
    this.RAIN_INCREASED_CHANCE = RAIN_INCREASE;
    this.upgrade = upgrade;
  }
}