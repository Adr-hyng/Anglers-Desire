import { ItemTypes } from "@minecraft/server";
class CompatibilityLootManager {
    static get TacosFish() {
        return ItemTypes.get('taco:catfish');
    }
}
export class CompatibleAddonHandler {
    static getAll() {
        const allAvailableCompatibleAddons = Object.getOwnPropertyNames(CompatibilityLootManager).filter((prop) => !(['length', 'name', 'prototype'].includes(prop)));
        return allAvailableCompatibleAddons;
    }
    static isInstalled(addonCompatibilityName) {
        return CompatibilityLootManager[addonCompatibilityName] !== undefined;
    }
}
