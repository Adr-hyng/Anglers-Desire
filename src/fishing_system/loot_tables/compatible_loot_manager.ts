import { ItemTypes } from "@minecraft/server";

// Core items are used to check if certain addon exists.
class CompatibilityLootManager {
  static get TacosFish() {
    return ItemTypes.get('taco:catfish');
  }
}

export class CompatibleAddonHandler {
  private static getAll(): string[] {
    const allAvailableCompatibleAddons = Object.getOwnPropertyNames(CompatibilityLootManager).filter((prop) => !(['length', 'name', 'prototype'].includes(prop)));
    return allAvailableCompatibleAddons;
  }

  // Check if other addon, which is compatible with this addon is installed in the current world.
  static isInstalled(addonCompatibilityName: AvailableCompatibleAddon): boolean {
    return CompatibilityLootManager[addonCompatibilityName] !== undefined;
  }
} 

type AvailableCompatibleAddon = Exclude<keyof typeof CompatibilityLootManager, 'prototype'>;