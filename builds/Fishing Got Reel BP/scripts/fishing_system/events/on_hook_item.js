import { system } from "@minecraft/server";
import { fishers } from "constant";
import { LootTable } from "fishing_system/loot_tables/loot_tables";
import { Logger } from "utils/index";
import { overrideEverything } from "overrides/index";
overrideEverything();
export async function onHookedItem(fisher, hookPos, enchantmentLevel, isDeeplySubmerged = false) {
    const player = fisher.source;
    system.run(() => {
        try {
            if (fisher.fishingRod.damageDurability(3))
                return;
            const drops = player.dimension.spawnLoot(LootTable[fisher.currentBiomeLootTable[fisher.currentBiome]](enchantmentLevel, isDeeplySubmerged), hookPos);
            fisher.setFishCaught(drops[0]);
            fisher.reelFish();
            fishers.set(player.id, fisher);
        }
        catch (e) {
            Logger.error(e.stack);
        }
        ;
        return;
    });
}
