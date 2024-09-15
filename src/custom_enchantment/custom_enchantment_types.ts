import { FishingCustomEnchantmentType } from "./available_custom_enchantments";
import { CustomEnchantment } from "./custom_enchantment";
export class CustomEnchantmentTypes {
  private static CachedAvailableEnchantments: Array<CustomEnchantment> = [];
  private static CachedImplementedEnchantments: Set<string>;

  static get(customEnchantmentType: CustomEnchantment): CustomEnchantment {
    const allAvailableCustomEnchantments = this.CachedAvailableEnchantments.length ? this.CachedAvailableEnchantments : this.getAll();
    const customEnchant = allAvailableCustomEnchantments.filter((enchantment) => enchantment.name === customEnchantmentType.name)[0];
    customEnchant.level = customEnchantmentType.level ?? 1;
    return customEnchant;
  }

  static getAll(): CustomEnchantment[] {
    if(!this.CachedAvailableEnchantments.length) {
      const customEnchantments = Object.getOwnPropertyNames(FishingCustomEnchantmentType).filter((prop) => !(['length', 'name', 'prototype'].includes(prop)));
      const availableEnchantments: CustomEnchantment[] = [];
      for(const customEnchantmentKey of customEnchantments) {
        availableEnchantments.push((FishingCustomEnchantmentType[customEnchantmentKey] as CustomEnchantment).clone()); 
      }
      this.CachedAvailableEnchantments = availableEnchantments;
    }
    return this.CachedAvailableEnchantments;
  }

  static getAllAsProperties() {
    if(!this.CachedImplementedEnchantments.size) {
      const ImplementedEnchantments = Object.getOwnPropertyNames(FishingCustomEnchantmentType).filter((prop) => !(['length', 'name', 'prototype'].includes(prop)));
      this.CachedImplementedEnchantments = new Set(ImplementedEnchantments);
      return ImplementedEnchantments;
    }
    return this.CachedImplementedEnchantments;
  }
}