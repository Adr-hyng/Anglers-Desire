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
    description: "Increases the chances of reeling in rare items and treasures rather than ordinary fish",
    lore: "Legend says Nautilus, a guardian of the deep, who hoards the ocean’s most coveted treasures within its spiral shell. Fishermen who wield this hook are said to draw upon the Nautilus's ancient duty, guiding their line towards riches hidden beneath the waves.",
    level: 1, 
    maxUsage: 75, 
    conflicts: ["Pyroclasm Hook", "Fermented Hook"],
  }); }
  static get Luminous(): CustomEnchantment { return new CustomEnchantment({
    icon: "textures/items/luminous_siren_hook",
    dynamicPropId: "Luminous",
    id: MyCustomItemTypes.LuminousHook, 
    name: "Luminous Hook", 
    description: "Enhances the likelihood of encountering rare sea creatures over common catches",
    lore: "Forged from the glowing ink of the luminescent squid, the Luminous Hook emits a subtle light that beckons the mysterious and rare creatures of the deep. It is whispered that these creatures are irresistibly drawn to this light, mistaking it for the moonlight that guides their way through the dark abyss.",
    level: 1, 
    maxUsage: 54,
  }); }
  static get Pyroclasm(): CustomEnchantment { return new CustomEnchantment({
    icon: "textures/items/pyroclasm_hook",
    dynamicPropId: "Pyroclasm",
    id: MyCustomItemTypes.PyroclasmHook, 
    name: "Pyroclasm Hook", 
    description: "Causes any caught fish to be engulfed in flames upon reeling them in",
    lore: "The Pyroclasm Hook is said to be forged from the fiery essence of creatures born in realms of eternal flame and ash. These beings are known for their ability to thrive in extreme heat, and the hook channels their burning fury, igniting any fish that dares to be caught, as if it were seared by the breath of these infernal beings.",
    level: 1, 
    maxUsage: 45, 
    conflicts: ["Nautilus Hook"],
  }); }
  static get Tempus(): CustomEnchantment { return new CustomEnchantment({
    icon: "textures/items/tempus_hook",
    dynamicPropId: "Tempus",
    id: MyCustomItemTypes.TempusHook, 
    name: "Tempus Hook",
    description: "Increases the window of opportunity for successful reeling, giving more time before a catch is lost",
    lore: "The Tempus Hook is entwined with shards of ancient amethyst, rumored to have been touched by the sands of time. It is said that this hook manipulates the flow of time itself, slowing it just enough to give fishermen the crucial extra moments needed to secure their catch.",
    level: 1, 
    maxUsage: 92,
  }); }
  static get FermentedEye(): CustomEnchantment { return new CustomEnchantment({
    icon: "textures/items/fermented_spider_eye_hook",
    dynamicPropId: "FermentedEye",
    id: MyCustomItemTypes.FermentedSpiderEyeHook, 
    name: "Fermented Hook", 
    description: "Shifts the balance towards catching more sea creatures than items",
    lore: "Soaked in the essence of a fermented spider eye, this hook exudes a pungent scent that permeates the ocean. Sea creatures, unable to resist its tantalizing aroma, are drawn to it like moths to a flame, making them more likely to take the bait.",
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