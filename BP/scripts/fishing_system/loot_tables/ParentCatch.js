import { world } from "@minecraft/server";
export class ParentCatchLoot {
    static FilteredEntityEntry() {
        const rainChanceModifier = this.RAIN_INCREASED_CHANCE / 100;
        const isRaining = world.IsRaining;
        const totalGeneralWeight = this.GeneralLoots.reduce((sum, loot) => sum + loot.weight, 0);
        const additionalLoots = [
            ...(this.upgrade.has("Luminous") ? this.LuminousLoots : []),
            ...(isRaining ? this.SpecialRainLoots : [])
        ];
        const additionalWeight = additionalLoots.reduce((sum, loot) => sum + loot.weight, 0);
        if (additionalWeight > 0) {
            const weightReductionFactor = (totalGeneralWeight - additionalWeight) / totalGeneralWeight;
            for (let loot of this.GeneralLoots) {
                loot.weight *= weightReductionFactor;
            }
        }
        const BlendedLoots = [
            ...additionalLoots,
            ...this.GeneralLoots
        ];
        if (isRaining) {
            for (let loot of BlendedLoots) {
                loot.weight *= rainChanceModifier;
            }
        }
        return BlendedLoots;
    }
    static initializeAttributes(upgrade, RAIN_INCREASE, entityLoots) {
        this.GeneralLoots = entityLoots.GeneralLoots;
        this.SpecialRainLoots = entityLoots.SpecialRainLoots;
        this.LuminousLoots = entityLoots.LuminousLoots;
        this.RAIN_INCREASED_CHANCE = RAIN_INCREASE;
        this.upgrade = upgrade;
    }
}
ParentCatchLoot.RAIN_INCREASED_CHANCE = 150;
