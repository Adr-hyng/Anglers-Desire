import { GameMode, Player, EntityEquippableComponent } from "@minecraft/server";
import { Configuration } from "fishing_system/configuration/configuration_screen";
import { OverTakes } from "overrides/partial_overtakes";
const screenConfigs = new WeakMap();
OverTakes(Player.prototype, {
    equippedToolSlot(equipmentSlot) {
        if (!(this.hasComponent(EntityEquippableComponent.componentId)))
            return;
        const equipment = this.getComponent(EntityEquippableComponent.componentId);
        if (!equipment.isValid())
            return;
        return equipment.getEquipmentSlot(equipmentSlot);
    },
    equippedTool(equipmentSlot) {
        if (!(this.hasComponent(EntityEquippableComponent.componentId)))
            return;
        const equipment = this.getComponent(EntityEquippableComponent.componentId);
        if (!equipment.isValid())
            return;
        return equipment.getEquipment(equipmentSlot);
    },
    isSurvival() {
        return this.getGameMode() === GameMode.survival;
    },
    get configuration() {
        let sc = screenConfigs.get(this);
        if (!sc)
            screenConfigs.set(this, sc = new Configuration(this));
        return sc;
    }
});
