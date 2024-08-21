import { JungleCatch, DefaultCatch } from "./index";
export class LootTable {
    static fishingModifier(LoTSLevel, isDeeplySubmerged = false) {
        const deepTreasureModifier = (isDeeplySubmerged ? 34.5 : 0);
        return { LoTSModifier: LoTSLevel, deepnessModifier: deepTreasureModifier };
    }
    static FishingJunk(level, isDeeplySubmerged = false, upgrade) {
        return DefaultCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), upgrade);
    }
    static FishingJungleJunk(level, isDeeplySubmerged = false, upgrade) {
        return JungleCatch.Loot(this.fishingModifier(level, isDeeplySubmerged), upgrade);
    }
}
