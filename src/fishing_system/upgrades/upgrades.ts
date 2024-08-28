


import { ItemEnchantableComponent, ItemStack } from "@minecraft/server";
import { AvailableCustomEnchantments, FishingCustomEnchantmentType } from "custom_enchantment/custom_enchantment_types";
import { overrideEverything } from "overrides/index";
overrideEverything()

export class HookUpgrades {
  private source: ItemStack;
  constructor(source: ItemStack) {
    this.source = source;
  }
  has(customEnchant: AvailableCustomEnchantments): boolean {
    return (this.source.getComponent(ItemEnchantableComponent.componentId) as ItemEnchantableComponent)
    .override(this.source).hasCustomEnchantment(FishingCustomEnchantmentType[customEnchant]);
  }
}