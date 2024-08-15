import {RangeInternal, LootTableType } from "types/index";
import { Jungle, Default } from "./index";

const LUCK_MODIFIER: number = 5;

export class LootTable {
  private static fishingModifier(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false) {
    const enchantmentModifier = (level * LUCK_MODIFIER);
    const deepTreasureModifier = (isDeeplySubmerged ? 45 : 0);
    return (enchantmentModifier + deepTreasureModifier);
  }
  static FishingJunk(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false): LootTableType {
    return Default.loot(this.fishingModifier(level, isDeeplySubmerged));
  }

  static FishingJungleJunk(level: RangeInternal<0, 4>, isDeeplySubmerged: boolean = false): LootTableType {
    return Jungle.loot(this.fishingModifier(level, isDeeplySubmerged));
  }
}