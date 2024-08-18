import { Player, Entity } from "@minecraft/server";
import { spawnedLogMap, localFishersCache } from "constant";
import { Fisher } from "fishing_system/entities/fisher";
import { onHookLanded } from "./on_wait_hook_stablized";

export function onFishingHookCreated(entitySpawned: Entity, fisher: Fisher): void {
  if (entitySpawned.typeId !== "minecraft:fishing_hook") return;
  const player = fisher.source;
  const oldLog = spawnedLogMap.get(player.id) as number;
  spawnedLogMap.set(player.id, Date.now());
  if ((oldLog + 150) >= Date.now()) return;
  localFishersCache.set(player.id, fisher.reset());
  fisher.setFishingHook(entitySpawned);
  fisher.currentBiome = fisher.fishingHook.getProperty("yn:current_biome_bit") as number;
  localFishersCache.set(player.id, fisher);
  onHookLanded(player);
}