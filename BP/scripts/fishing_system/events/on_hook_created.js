import { spawnedLogMap, localFishersCache } from "constant";
import { onHookLanded } from "./on_wait_hook_stablized";
export function onFishingHookCreated(entitySpawned, fisher) {
    if (entitySpawned.typeId !== "minecraft:fishing_hook")
        return;
    const player = fisher.source;
    const oldLog = spawnedLogMap.get(player.id);
    spawnedLogMap.set(player.id, Date.now());
    if ((oldLog + 150) >= Date.now())
        return;
    localFishersCache.set(player.id, fisher.reset());
    fisher.setFishingHook(entitySpawned);
    fisher.currentBiome = fisher.fishingHook.getProperty("yn:current_biome_bit");
    localFishersCache.set(player.id, fisher);
    onHookLanded(player);
}
