import { MyCustomItemTypes } from "fishing_system/items/custom_items";
import { CustomEnchantment } from "./custom_enchantment";
export class FishingCustomEnchantmentType {
  // Storing just the lore.
  static get Nautilus(): CustomEnchantment { return CustomEnchantment.from({
    id: MyCustomItemTypes.NautilusHook,
    name: "Nautilus Hook",
    level: 1, 
    maxUsage: 50, 
    conflicts: ["Pyroclasm Hook"]
  }); }
  static get LuminousSiren(): CustomEnchantment { return CustomEnchantment.from({
    id: MyCustomItemTypes.LuminousHook, 
    name: "Luminous Siren Hook", 
    level: 1, 
    maxUsage: 50
  }); }
  static get Pyroclasm(): CustomEnchantment { return CustomEnchantment.from({
    id: MyCustomItemTypes.PyroclasmHook, 
    name: "Pyroclasm Hook", 
    level: 1, 
    maxUsage: 50, 
    conflicts: ["Nautilus Hook"]
  }); }
  static get Tempus(): CustomEnchantment { return CustomEnchantment.from({
    id: MyCustomItemTypes.TempusHook, 
    name: "Tempus Hook",
    level: 1, 
    maxUsage: 50
  }); }
  static get FermentedSpiderEyeHook(): CustomEnchantment { return CustomEnchantment.from({
    id: MyCustomItemTypes.FermentedSpiderEyeHook, 
    name: "Hook With Fermented Spider Eye", 
    level: 1, 
    maxUsage: 50
  }); }

  static getAll(): string[] {
    return Object.getOwnPropertyNames(this).filter((prop) => !(['length', 'name', 'prototype', 'getAll'].includes(prop)));
  }
}


export class CustomEnchantmentTypes {
  private static CachedAvailableEnchantments: Array<CustomEnchantment> = [];

  static get(customEnchantmentType: CustomEnchantment): CustomEnchantment {
    const customEnchant = this.getAll().filter((enchantment) => enchantment.name === customEnchantmentType.name)[0];
    customEnchant.level = customEnchantmentType.level ?? 1;
    return customEnchant;
  }

  static getAll(): CustomEnchantment[] {
    
    // If it doesn't have yet, then just create, if it does, then just use that.
    if(!this.CachedAvailableEnchantments.length) {
      const customEnchantments = FishingCustomEnchantmentType.getAll();
      const availableEnchantments: CustomEnchantment[] = [];
      for(const customEnchantmentKey of customEnchantments) {
        availableEnchantments.push(FishingCustomEnchantmentType[customEnchantmentKey]);
      }
      this.CachedAvailableEnchantments = availableEnchantments;
      return availableEnchantments;
    } 
    return this.CachedAvailableEnchantments;
  }
}

export type AvailableCustomEnchantments = Exclude<keyof typeof FishingCustomEnchantmentType, 'prototype' | 'getAll'>;