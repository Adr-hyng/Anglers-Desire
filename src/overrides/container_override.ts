
import { 
  Container,
  EntityEquippableComponent,
  EquipmentSlot,
  ItemStack,
  Player
} from '@minecraft/server';
import { OverTakes } from "overrides/partial_overtakes";

declare module "@minecraft/server" {
  interface Container {
    source: Player;
    override(sourceEntity: Player): Container;
    clearItem(itemId: string, decrement: number): boolean;
  }
}


OverTakes(Container.prototype, {
  override(sourceEntity: Player): Container {
    this.source = sourceEntity;
    if(!this.source) throw "No Entity source found";
    return this;
  },
  clearItem(itemId: string, decrement: number): boolean {
    if(!this.source) throw "No Entity source found";
    const clearSlots = [];
    const equipment = (this.source.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent);
    const offhand = equipment.getEquipment(EquipmentSlot.Offhand);
    for (let i = 0; i < this.size; i++) {
        let item: ItemStack = this.getItem(i);
        if (item?.typeId !== itemId) continue;
        if (decrement - item.amount > 0) {
            decrement -= item.amount;
            clearSlots.push(i);
            continue;
        }; clearSlots.forEach(s => this.setItem(s));
        if (decrement - item.amount === 0) {
            this.setItem(i);
            return true;
        }; item.amount -= decrement;
        this.setItem(i, item);
        return true;
    }; 
    if(offhand?.typeId === itemId) {
        if(offhand?.amount - decrement === 0) {
            equipment.setEquipment(EquipmentSlot.Offhand, undefined);
            return true;
        }
        if(offhand?.amount - decrement > 0) {
            offhand.amount -= decrement;
            equipment.setEquipment(EquipmentSlot.Offhand, offhand);
            return true;
        }
    }
  }
});
