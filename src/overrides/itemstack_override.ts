
import { ItemEnchantableComponent, ItemStack } from "@minecraft/server";
import { OverTakes } from "./partial_overtakes";

declare module "@minecraft/server" {
  interface ItemStack {
    asEntity: string;
    hasLore(loreId: string): boolean;
    get enchantment(): ItemEnchantableComponent;
  }
}

OverTakes(ItemStack.prototype, {
  hasLore(loreId) {
    return this.getLore().some(lore => lore.startsWith(loreId));
  },
  get enchantment() {
    return (this.getComponent(ItemEnchantableComponent.componentId) as ItemEnchantableComponent);
  },
});