import { MyCustomItemTypes } from "fishing_system/items/custom_items";

export type CustomEnchantment = {
  level: number;
  name: string;
  id?: string;
  conflicts?: string[];
}

export class FishingCustomEnchantmentType {
  static get Nautilus(): CustomEnchantment { return {id: MyCustomItemTypes.NautilusHook ,name: "Nautilus Hook", level: 1, conflicts: ["Pyroclasm Hook"]} as CustomEnchantment; }
  static get LuminousSiren(): CustomEnchantment { return {id: MyCustomItemTypes.LuminousHook, name: "Luminous Siren Hook", level: 1} as CustomEnchantment; }
  static get Pyroclasm(): CustomEnchantment { return {id: MyCustomItemTypes.PyroclasmHook, name: "Pyroclasm Hook", level: 1, conflicts: ["Nautilus Hook"]} as CustomEnchantment; }
  static get Tempus(): CustomEnchantment { return {id: MyCustomItemTypes.TempusHook, name: "Tempus Hook", level: 1} as CustomEnchantment; }
  static get FermentedSpiderEyeHook(): CustomEnchantment { return {id: MyCustomItemTypes.FermentedSpiderEyeHook, name: "Hook With Fermented Spider Eye", level: 1} as CustomEnchantment; }
}


export class CustomEnchantmentTypes {
  static get(customEnchantmentType: CustomEnchantment): CustomEnchantment {
    const customEnchant = this.getAll().filter((enchantment) => enchantment.name === customEnchantmentType.name)[0];
    customEnchant.level = customEnchantmentType.level ?? 1;
    return customEnchant;
  }

  static getAll(): CustomEnchantment[] {
    const customEnchantments = Object.getOwnPropertyNames(FishingCustomEnchantmentType).filter((prop) => !(['length', 'name', 'prototype'].includes(prop)));
    const availableEnchantments: CustomEnchantment[] = [];
    for(const customEnchantmentKey of customEnchantments) {
      availableEnchantments.push(FishingCustomEnchantmentType[customEnchantmentKey]);
    }
    return availableEnchantments;
  }
}

export type AvailableCustomEnchantments = Exclude<keyof typeof FishingCustomEnchantmentType, "prototype">;