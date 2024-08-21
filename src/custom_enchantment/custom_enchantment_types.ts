export type CustomEnchantment = {
  level: number;
  name: string;
  conflicts?: string[];
}

export class FishingCustomEnchantmentType {
  static get Nautilus(): CustomEnchantment { return {name: "Nautilus Hook", level: 1, conflicts: ["Pyroclasm Hook"]} as CustomEnchantment; }
  static get LuminousSiren(): CustomEnchantment { return {name: "Luminous Siren Hook", level: 1} as CustomEnchantment; }
  static get Pyroclasm(): CustomEnchantment { return {name: "Pyroclasm Hook", level: 1, conflicts: ["Nautilus Hook"]} as CustomEnchantment; }
  static get Tempus(): CustomEnchantment { return {name: "Tempus Hook", level: 1} as CustomEnchantment; }
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