import { Player, Entity } from "@minecraft/server";
import { spawnedLogMap, fishers } from "constant";
import { Fisher } from "fishing_system/entities/fisher";
import { onHookLanded } from "./on_wait_hook_stablized";

export function onFishingHookCreated(player: Player, entitySpawned: Entity, fisher: Fisher): void {
  if (entitySpawned.typeId !== "minecraft:fishing_hook") return;

  const oldLog = spawnedLogMap.get(player.id) as number;
  spawnedLogMap.set(player.id, Date.now());
  if ((oldLog + 150) >= Date.now()) return;
  fishers.set(player.id, fisher.reset());
  fisher.setFishingHook(entitySpawned);
  fisher.currentBiome = fisher.fishingHook.getProperty("yn:current_biome_bit") as number;
  fishers.set(player.id, fisher);
  onHookLanded(player);
}