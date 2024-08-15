import {RangeInternal, LootTableType } from "types/index";
import { JungleCatch, DefaultCatch } from "./index";


export class LootTable {
  private static fishingModifier(LoTSLevel: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false) {
    const deepTreasureModifier = (isDeeplySubmerged ? 34.5 : 0);
    return {LoTSModifier: LoTSLevel, deepnessModifier: deepTreasureModifier};
  }
  static FishingJunk(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false): LootTableType {
    return DefaultCatch.loot( this.fishingModifier(level, isDeeplySubmerged));
  }

  static FishingJungleJunk(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false): LootTableType {
    return JungleCatch.loot( this.fishingModifier(level, isDeeplySubmerged));
  }
}