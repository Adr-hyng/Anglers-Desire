
import { ItemEnchantableComponent, ItemStack } from '@minecraft/server';
import { overrideEverything } from 'overrides/index';
import { OverTakes } from "overrides/partial_overtakes";
import { CustomEnchantment, CustomEnchantmentTypes } from './custom_enchantment_types';

overrideEverything();



declare module "@minecraft/server" {
  interface ItemEnchantableComponent {
    /**
     * Make sure this exists, else it will error.
     */
    source: ItemStack;
    override(sourceItem: ItemStack): this;
    /**
     * Only applicable with level 1 enchantment, haven't written a override for level.
     */
    addCustomEnchantment(enchantment: CustomEnchantment): void;
    hasCustomEnchantment(enchantmentID: CustomEnchantment): boolean;
  }
}

OverTakes(ItemEnchantableComponent.prototype, {
  override(sourceItem: ItemStack) {
    this.source = sourceItem;
    return this;
  },
  addCustomEnchantment(enchantment: CustomEnchantment): void {
    if(!CustomEnchantmentTypes.get(enchantment)) throw "Custom Enchantment not implemented yet";

    // Custom Enchantment not found in the selected item.
    if(this.hasCustomEnchantment(enchantment)) return;
    const enchantmentInfo = `§r§7${enchantment.name} ${enchantment.level}`;
    this.source.setLore([...this.source.getLore(), enchantmentInfo]);
  },
  hasCustomEnchantment(enchantment: CustomEnchantment): boolean {
    return this.source.hasLore(`§r§7${enchantment.name} ${enchantment.level}`);
  },
});