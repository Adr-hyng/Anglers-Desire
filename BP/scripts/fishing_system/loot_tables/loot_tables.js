import { JungleCatch, DefaultCatch } from "./index";
export class LootTable {
    static fishingModifier(LoTSLevel, isDeeplySubmerged = false) {
        const deepTreasureModifier = (isDeeplySubmerged ? 34.5 : 0);
        return { LoTSModifier: LoTSLevel, deepnessModifier: deepTreasureModifier };
    }
    static FishingJunk(level, isDeeplySubmerged = false) {
        return DefaultCatch.loot(this.fishingModifier(level, isDeeplySubmerged));
    }
    static FishingJungleJunk(level, isDeeplySubmerged = false) {
        return JungleCatch.loot(this.fishingModifier(level, isDeeplySubmerged));
    }
}
