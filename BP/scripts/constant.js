import { JsonDatabase } from "./utils/Database/con-database";
import { Fisher } from "./fishing_system/entities/fisher";
export const ADDON_NAMESPACE = "yn";
export const ADDON_NAME = "Anglers_Desire";
export const ADDON_IDENTIFIER = `${ADDON_NAMESPACE}:anglers`;
export const db = new JsonDatabase(ADDON_NAME);
export const localFishersCache = new Map();
export const onSpawnHookLogMap = new Map();
export const onCaughtParticleLogMap = new Map();
export const onLostParticleLogMap = new Map();
export const onHookLandedCallingLogMap = new Map();
export const onCustomBlockInteractLogMap = new Map();
export function fetchFisher(player) {
    const existingFisher = localFishersCache.get(player.id);
    if (existingFisher) {
        return existingFisher;
    }
    const newFisher = new Fisher(player);
    localFishersCache.set(player.id, newFisher);
    return newFisher;
}
