import { MyCustomItemTypes } from "fishing_system/items/custom_items";
import { CustomEnchantment } from "./custom_enchantment";
export class FishingCustomEnchantmentType {
  // Please separate the constructor for custom enchantment used only for this class
  // meanwhile 'from', is used to only get from this class, so constructors need to be completed
  // while 'from' only need name, and level for maintainability purposes.

  // Also use localization for: Description
  static get Nautilus(): CustomEnchantment { return new CustomEnchantment({
    icon: "textures/items/nautilus_hook",
    dynamicPropId: "Nautilus",
    id: MyCustomItemTypes.NautilusHook,
    name: "Nautilus Hook",
    description: "yn:fishing_got_reel.enchantments.nautilus.description",
    lore: "yn:fishing_got_reel.enchantments.nautilus.lore",
    level: 1, 
    maxUsage: 75, 
    conflicts: ["Pyroclasm Hook", "Fermented Hook"],
  }); }
  static get Luminous(): CustomEnchantment { return new CustomEnchantment({
    icon: "textures/items/luminous_siren_hook",
    dynamicPropId: "Luminous",
    id: MyCustomItemTypes.LuminousHook, 
    name: "Luminous Hook", 
    description: "yn:fishing_got_reel.enchantments.luminous.description",
    lore: "yn:fishing_got_reel.enchantments.luminous.lore",
    level: 1, 
    maxUsage: 54,
  }); }
  static get Pyroclasm(): CustomEnchantment { return new CustomEnchantment({
    icon: "textures/items/pyroclasm_hook",
    dynamicPropId: "Pyroclasm",
    id: MyCustomItemTypes.PyroclasmHook, 
    name: "Pyroclasm Hook", 
    description: "yn:fishing_got_reel.enchantments.pyroclasm.description",
    lore: "yn:fishing_got_reel.enchantments.pyroclasm.lore",
    level: 1, 
    maxUsage: 45, 
    conflicts: ["Nautilus Hook"],
  }); }
  static get Tempus(): CustomEnchantment { return new CustomEnchantment({
    icon: "textures/items/tempus_hook",
    dynamicPropId: "Tempus",
    id: MyCustomItemTypes.TempusHook, 
    name: "Tempus Hook",
    description: "yn:fishing_got_reel.enchantments.tempus.description",
    lore: "yn:fishing_got_reel.enchantments.tempus.lore",
    level: 1, 
    maxUsage: 92,
  }); }
  static get FermentedEye(): CustomEnchantment { return new CustomEnchantment({
    icon: "textures/items/fermented_spider_eye_hook",
    dynamicPropId: "FermentedEye",
    id: MyCustomItemTypes.FermentedSpiderEyeHook, 
    name: "Fermented Hook", 
    description: "yn:fishing_got_reel.enchantments.fermentedeye.description",
    lore: "yn:fishing_got_reel.enchantments.fermentedeye.lore",
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
        availableEnchantments.push(FishingCustomEnchantmentType[customEnchantmentKey] as CustomEnchantment);
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