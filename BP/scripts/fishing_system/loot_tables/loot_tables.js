import { Jungle, Default } from "./index";
const LUCK_MODIFIER = 5;
export class LootTable {
    static fishingModifier(level, isDeeplySubmerged = false) {
        const enchantmentModifier = (level * LUCK_MODIFIER);
        const deepTreasureModifier = (isDeeplySubmerged ? 45 : 0);
        return (enchantmentModifier + deepTreasureModifier);
    }
    static FishingJunk(level, isDeeplySubmerged = false) {
        return Default.loot(this.fishingModifier(level, isDeeplySubmerged));
    }
    static FishingJungleJunk(level, isDeeplySubmerged = false) {
        return Jungle.loot(this.fishingModifier(level, isDeeplySubmerged));
    }
}
