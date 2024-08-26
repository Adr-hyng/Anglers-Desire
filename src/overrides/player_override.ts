import { GameMode, Player, EquipmentSlot, ItemStack, EntityEquippableComponent, ContainerSlot} from "@minecraft/server";
import { Configuration } from "fishing_system/configuration/configuration_screen";
import { OverTakes } from "overrides/partial_overtakes";
import {} from "fishing_system/items/fishing_rod";

declare module "@minecraft/server" {
  interface Player {
    configuration: Configuration;
    isSurvival(): boolean;
    equippedToolSlot(equipmentSlot: EquipmentSlot.Mainhand | EquipmentSlot.Offhand): ContainerSlot;
    equippedTool(equipmentSlot: EquipmentSlot.Mainhand | EquipmentSlot.Offhand): ItemStack;
  }
}

const screenConfigs = new WeakMap<Player, Configuration>();

OverTakes(Player.prototype, {
  equippedToolSlot(equipmentSlot: EquipmentSlot.Mainhand | EquipmentSlot.Offhand): ContainerSlot | null {
    if(!(this.hasComponent(EntityEquippableComponent.componentId)) ) return;
    const equipment = (this.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent);
    if(!equipment.isValid()) return;
    return equipment.getEquipmentSlot(equipmentSlot);
  },
  equippedTool(equipmentSlot: EquipmentSlot.Mainhand | EquipmentSlot.Offhand): ItemStack | null {
    if(!(this.hasComponent(EntityEquippableComponent.componentId)) ) return;
    const equipment = (this.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent);
    if(!equipment.isValid()) return;
    return equipment.getEquipment(equipmentSlot);
  },
  isSurvival(): boolean {
    return this.getGameMode() === GameMode.survival;
  },
  get configuration() {
    let sc = screenConfigs.get(this);
    if(!sc) screenConfigs.set(this, sc = new Configuration(this));
    return sc;
  }
});