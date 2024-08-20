


import { ItemEnchantableComponent } from "@minecraft/server";
import { AvailableCustomEnchantments, FishingCustomEnchantmentType } from "custom_enchantment/custom_enchantment_types";

export class HookUpgrades {
  private _source: ItemEnchantableComponent;
  constructor(source: ItemEnchantableComponent) {
    this._source = source;
  }
  // Checks if this itemEquipment has this custom upgrade
  has(customUpgrade: AvailableCustomEnchantments): boolean {
    return this._source.hasCustomEnchantment(FishingCustomEnchantmentType[customUpgrade]);
  }
}

// fishingRod.upgrade.has(FishingCustomEnchantment.<...>)