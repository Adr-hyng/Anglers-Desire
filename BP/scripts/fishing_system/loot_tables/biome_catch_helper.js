export class ParentCatchLoot {
    static FilteredEntityEntry() {
        const rainChanceModifier = this.RAIN_INCREASED_CHANCE / 100;
        const isRaining = this.fisher.currentWeather > 0;
        const totalGeneralWeight = this.GeneralLoots.reduce((sum, loot) => sum + loot.weight, 0);
        const additionalLoots = [
            ...(this.fisher.fishingRod.upgrade.has("Luminous") ? this.LuminousLoots : []),
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
    static initializeAttributes(fisher, RAIN_INCREASE, entityLoots) {
        this.GeneralLoots = entityLoots.GeneralLoots;
        this.SpecialRainLoots = entityLoots.SpecialRainLoots;
        this.LuminousLoots = entityLoots.LuminousLoots;
        this.RAIN_INCREASED_CHANCE = RAIN_INCREASE;
        this.fisher = fisher;
    }
}
ParentCatchLoot.RAIN_INCREASED_CHANCE = 150;
