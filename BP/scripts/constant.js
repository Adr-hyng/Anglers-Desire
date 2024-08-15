import { JsonDatabase } from "./utils/Database/con-database";
import { Fisher } from "./fishing_system/entities/fisher";
export const ADDON_NAMESPACE = "yn";
export const ADDON_NAME = "IMMERSIVE_FISHING";
export const ADDON_IDENTIFIER = `${ADDON_NAMESPACE}:immersif`;
export const db = new JsonDatabase(ADDON_NAME);
export const fishers = new Map();
export const spawnedLogMap = new Map();
export const fishingCallingLogMap = new Map();
export function fetchFisher(player) {
    const existingFisher = fishers.get(player.id);
    if (existingFisher) {
        return existingFisher;
    }
    const newFisher = new Fisher(player);
    fishers.set(player.id, newFisher);
    return newFisher;
}
