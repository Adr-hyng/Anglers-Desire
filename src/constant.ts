import { JsonDatabase } from "./utils/Database/con-database";
import { Fisher } from "./fishing_system/entities/fisher";
import { Player } from "@minecraft/server";

export const ADDON_NAMESPACE: string = "yn"
export const ADDON_NAME: string = "FISHING_GOT_REEL";
export const ADDON_IDENTIFIER: string = `${ADDON_NAMESPACE}:fishreel`;
export const db = new JsonDatabase(ADDON_NAME);

export const fishers: Map<string, Fisher> = new Map();
export const spawnedLogMap: Map<string, number> = new Map();
export const fishingCallingLogMap: Map<string, number> = new Map();

export function fetchFisher(player: Player): Fisher {
  const existingFisher = fishers.get(player.id);
  if (existingFisher) {
      return existingFisher;
  }
  const newFisher = new Fisher(player);
  fishers.set(player.id, newFisher);
  return newFisher;
}
