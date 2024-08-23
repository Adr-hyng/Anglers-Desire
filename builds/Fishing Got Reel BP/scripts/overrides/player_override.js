import { GameMode, Player, EntityEquippableComponent } from "@minecraft/server";
import { __Configuration } from "fishing_system/configuration/configuration_screen";
import { OverTakes } from "overrides/partial_overtakes";
const screenConfigs = new WeakMap();
OverTakes(Player.prototype, {
    equippedTool(equipmentSlot) {
        return this.getComponent(EntityEquippableComponent.componentId).getEquipmentSlot(equipmentSlot).getItem();
    },
    isSurvival() {
        return this.getGameMode() === GameMode.survival;
    },
    get Configuration() {
        let sc = screenConfigs.get(this);
        if (!sc)
            screenConfigs.set(this, sc = new __Configuration(this));
        return sc;
    }
});
