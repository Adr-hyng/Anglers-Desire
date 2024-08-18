import { system } from "@minecraft/server";
import { localFishersCache } from "constant";
import { LootTable } from "fishing_system/loot_tables/loot_tables";
import { Logger } from "utils/index";
import { overrideEverything } from "overrides/index";
overrideEverything();
export function onHookedItem(fisher) {
    const player = fisher.source;
    system.run(() => {
        try {
            if (fisher.fishingRod.damageDurability(5))
                return;
            const hookLandedVector = fisher.fishingHook.stablizedLocation;
            const isDeeplySubmerged = fisher.fishingHook.isDeeplySubmerged;
            const enchantmentLevel = fisher.fishingRod.getLuckOfSea()?.level ?? 0;
            const drops = player.dimension.spawnLoot(LootTable[fisher.currentBiomeLootTable[fisher.currentBiome]](enchantmentLevel, isDeeplySubmerged), hookLandedVector);
            fisher.setEntityCaughtByHook(drops[0]);
            fisher.reelHook();
            localFishersCache.set(player.id, fisher);
        }
        catch (e) {
            Logger.error(e.stack);
        }
        ;
    });
}
