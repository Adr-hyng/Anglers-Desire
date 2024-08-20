export type CustomEnchantment = {
  level: number;
  name: string;
}

export class FishingCustomEnchantmentType {
  static get Flamekissed(): CustomEnchantment { return {name: "Flame Kissed", level: 1} as CustomEnchantment; }
  static get Thunderbite(): CustomEnchantment { return {name: "Thunderbite", level: 1} as CustomEnchantment; }
  static get TreasureCalls(): CustomEnchantment { return {name: "Treasure Calls", level: 1} as CustomEnchantment; }
}


export class CustomEnchantmentTypes {
  static get(customEnchantmentType: CustomEnchantment): CustomEnchantment | undefined {
    return this.getAll().find(enchantment => enchantment.name === customEnchantmentType.name);
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