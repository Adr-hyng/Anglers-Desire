import {RangeInternal, LootTableContent } from "types/index";
import { JungleCatch, DefaultCatch } from "./index";
import { HookUpgrades } from "fishing_system/upgrades/upgrades";


export class LootTable {
  private static fishingModifier(LoTSLevel: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false) {
    const deepTreasureModifier = (isDeeplySubmerged ? 34.5 : 0);
    return {LoTSModifier: LoTSLevel, deepnessModifier: deepTreasureModifier};
  }
  static FishingJunk(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return DefaultCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade);
  }

  static FishingJungleJunk(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false, upgrade: HookUpgrades): LootTableContent {
    return JungleCatch.Loot( this.fishingModifier(level, isDeeplySubmerged), upgrade);
  }
}