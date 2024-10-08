import { JsonDatabase } from "./utils/Database/con-database";
import { Fisher } from "./fishing_system/entities/fisher";
import { Player } from "@minecraft/server";

export const ADDON_NAMESPACE: string = "yn"
export const ADDON_NAME: string = "Anglers_Desire";
export const ADDON_IDENTIFIER: string = `${ADDON_NAMESPACE}:anglers`;
export const db = new JsonDatabase(ADDON_NAME);

export const localFishersCache: Map<string, Fisher> = new Map();
export const onSpawnHookLogMap: Map<string, number> = new Map();

export const onCaughtParticleLogMap: Map<string, number> = new Map();
export const onLostParticleLogMap: Map<string, number> = new Map();

export const onHookLandedCallingLogMap: Map<string, number> = new Map();
export const onCustomBlockInteractLogMap: Map<string, number> = new Map();

export function fetchFisher(player: Player): Fisher {
  const existingFisher = localFishersCache.get(player.id);
  if (existingFisher) {
      return existingFisher;
  }
  const newFisher = new Fisher(player);
  localFishersCache.set(player.id, newFisher);
  return newFisher;
}
