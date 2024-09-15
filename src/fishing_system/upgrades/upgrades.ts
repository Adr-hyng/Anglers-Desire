


import { ItemEnchantableComponent, ItemStack } from "@minecraft/server";
import { AvailableCustomEnchantments, FishingCustomEnchantmentType } from "custom_enchantment/available_custom_enchantments";
import { overrideEverything } from "overrides/index";
overrideEverything()

export class HookUpgrades {
  private source: ItemStack;
  constructor(source: ItemStack) {
    this.source = source;
  }
  has(customEnchant: AvailableCustomEnchantments): boolean {
    if(!this.source) return;
    return (this.source.getComponent(ItemEnchantableComponent.componentId) as ItemEnchantableComponent)
    .override(this.source).hasCustomEnchantment(FishingCustomEnchantmentType[customEnchant]);
  }
}