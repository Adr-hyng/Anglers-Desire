import { ItemTypes } from "@minecraft/server";
import { TacosFishEntityTypes } from "fishing_system/entities/compatibility/tacos_fish_mobs";
class CompatibilityLootManager {
    static get TacosFish() {
        return ItemTypes.get(TacosFishEntityTypes.Bass);
    }
}
export class CompatibleAddonHandler {
    static isInstalled(addonCompatibilityName) {
        return CompatibilityLootManager[addonCompatibilityName] !== undefined;
    }
}
