import { ItemTypes } from "@minecraft/server";
import { TacosFishEntityTypes } from "fishing_system/entities/compatibility/tacos_fish_mobs";

// Core items are used to check if certain addon exists.
class CompatibilityLootManager {
  static get TacosFish() {
    return ItemTypes.get(TacosFishEntityTypes.Bass);
  }
}

export class CompatibleAddonHandler {
  // Check if other addon, which is compatible with this addon is installed in the current world.
  static isInstalled(addonCompatibilityName: AvailableCompatibleAddon): boolean {
    return CompatibilityLootManager[addonCompatibilityName] !== undefined;
  }
} 

type AvailableCompatibleAddon = Exclude<keyof typeof CompatibilityLootManager, 'prototype'>;