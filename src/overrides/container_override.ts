
import { 
  Container,
  EntityEquippableComponent,
  EquipmentSlot,
  ItemStack,
  ItemType,
  Player
} from '@minecraft/server';
import { OverTakes } from "overrides/partial_overtakes";


type ContainerItemContent = {
  item: ItemStack;
  slot: number;
}

export type ItemStackOptions = {
  canDestroyOn: string[];
  canPlaceOn: string[];
  lore: string[];
}

declare module "@minecraft/server" {
  interface Container {
    source: Player;
    override(sourceEntity: Player): Container;
    giveItem(itemType: ItemType, amount: number, options?: ItemStackOptions): void;
    clearItem(itemId: string, decrement: number): boolean;
    getInventoryItems(): Generator<ContainerItemContent, any, unknown>;
  }
}

function stackDistribution(number: number, groupSize: number = 64): number[] {
  const fullGroupsCount = Math.floor(number / groupSize);
  const remainder = number % groupSize;
  const groups = new Array(fullGroupsCount).fill(groupSize);
  if (remainder > 0) groups.push(remainder);
  return groups;
}

OverTakes(Container.prototype, {
  override(sourceEntity: Player): Container {
    this.source = sourceEntity;
    if(!this.source) throw "No Entity source found";
    return this;
  },
  giveItem(itemType: ItemType, amount: number, options?: ItemStackOptions): void {
    if(!this.source) throw "No Entity source found";
    if(!amount) return;
    const item = new ItemStack(itemType);
    item.setCanDestroy(options.canDestroyOn);
    item.setCanPlaceOn(options.canPlaceOn);
    item.setLore(options.lore);
    let exceededAmount: number = 0;
    if(amount > item.maxAmount){
        const groupStacks = stackDistribution(amount, item.maxAmount);
        for(const stack of groupStacks) {
          item.amount = stack;
          exceededAmount += this.addItem(item)?.amount ?? 0;
        }
    } else {
        item.amount = amount;
        exceededAmount = this.addItem(item)?.amount ?? exceededAmount;
    }
    if(!exceededAmount) return;
    this.source.dimension.spawnItem(new ItemStack(itemType, exceededAmount), this.source.location);
  },  
  *getInventoryItems(): Generator<ContainerItemContent, any, unknown> {
    let currentAvailableSlotCounter = 0;
    for (let i = 0; i < this.size; i++) {
      let item: ItemStack = this.getItem(i);
      if(currentAvailableSlotCounter >= this.size - this.emptySlotsCount) break;
      if (!item) continue;
      currentAvailableSlotCounter++;
      yield ({item: item, slot: i});
    }; 
  },
  clearItem(itemId: string, decrement: number): boolean {
    if(!this.source) throw "No Entity source found";
    const clearSlots = [];
    const equipment = (this.source.getComponent(EntityEquippableComponent.componentId) as EntityEquippableComponent);
    const offhand = equipment.getEquipment(EquipmentSlot.Offhand);

    let currentAvailableSlotCounter = 0;
    for(const {item, slot} of this.getInventoryItems()) {
      if(currentAvailableSlotCounter >= this.size - this.emptySlotsCount) break;
      if (item?.typeId !== itemId) continue;
      currentAvailableSlotCounter++;
      if (decrement - item.amount > 0) {
          decrement -= item.amount;
          clearSlots.push(slot);
          continue;
      }; clearSlots.forEach(s => this.setItem(s));
      if (decrement - item.amount === 0) {
          this.setItem(slot);
          return true;
      }; item.amount -= decrement;
      this.setItem(slot, item);
      return true;
    }
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
