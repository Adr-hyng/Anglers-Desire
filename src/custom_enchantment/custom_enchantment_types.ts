import { MyCustomItemTypes } from "fishing_system/items/custom_items";
import { CustomEnchantment } from "./custom_enchantment";
export class FishingCustomEnchantmentType {
  // Storing just the lore.
  static get Nautilus(): CustomEnchantment { return CustomEnchantment.from({
    id: MyCustomItemTypes.NautilusHook,
    name: "Nautilus Hook",
    dynamicPropId: "Nautilus",
    level: 1, 
    maxUsage: 75, 
    conflicts: ["Pyroclasm Hook", "Fermented Hook"],
  }); }
  static get Luminous(): CustomEnchantment { return CustomEnchantment.from({
    id: MyCustomItemTypes.LuminousHook, 
    name: "Luminous Hook", 
    dynamicPropId: "Luminous",
    level: 1, 
    maxUsage: 54,
  }); }
  static get Pyroclasm(): CustomEnchantment { return CustomEnchantment.from({
    id: MyCustomItemTypes.PyroclasmHook, 
    name: "Pyroclasm Hook", 
    dynamicPropId: "Pyroclasm",
    level: 1, 
    maxUsage: 45, 
    conflicts: ["Nautilus Hook"],
  }); }
  static get Tempus(): CustomEnchantment { return CustomEnchantment.from({
    id: MyCustomItemTypes.TempusHook, 
    name: "Tempus Hook",
    dynamicPropId: "Tempus",
    level: 1, 
    maxUsage: 92
  }); }
  static get FermentedEye(): CustomEnchantment { return CustomEnchantment.from({
    id: MyCustomItemTypes.FermentedSpiderEyeHook, 
    name: "Fermented Hook", 
    dynamicPropId: "FermentedEye",
    level: 1, 
    maxUsage: 60,
    conflicts: ["Nautilus Hook"],
  }); }
}


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
        availableEnchantments.push(FishingCustomEnchantmentType[customEnchantmentKey]);
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

export type AvailableCustomEnchantments = Exclude<keyof typeof FishingCustomEnchantmentType, 'prototype'>;