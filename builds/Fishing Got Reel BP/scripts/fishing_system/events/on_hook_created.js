import { spawnedLogMap, fishers } from "constant";
import { FishingState } from "types/index";
import { onHookLanded } from "./on_wait_hook_stablized";
export function onFishingHookCreated(player, entitySpawned, fisher) {
    if (entitySpawned.typeId !== "minecraft:fishing_hook")
        return;
    const oldLog = spawnedLogMap.get(player.id);
    spawnedLogMap.set(player.id, Date.now());
    if ((oldLog + 150) >= Date.now())
        return;
    fishers.set(player.id, fisher.reset());
    fisher.setState(FishingState.CAST);
    fisher.setFishingHook(entitySpawned);
    fisher.currentBiome = fisher.fishingHook.getProperty("yn:current_biome_bit").valueOf();
    fishers.set(player.id, fisher);
    onHookLanded(player);
}
