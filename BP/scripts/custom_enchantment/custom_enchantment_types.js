export class FishingCustomEnchantmentType {
    static get Flamekissed() { return { name: "Flame Kissed", level: 1 }; }
    static get Thunderbite() { return { name: "Thunderbite", level: 1 }; }
    static get TreasureCalls() { return { name: "Treasure Calls", level: 1 }; }
}
export class CustomEnchantmentTypes {
    static get(customEnchantmentType) {
        return this.getAll().find(enchantment => enchantment.name === customEnchantmentType.name);
    }
    static getAll() {
        const customEnchantments = Object.getOwnPropertyNames(FishingCustomEnchantmentType).filter((prop) => !(['length', 'name', 'prototype'].includes(prop)));
        const availableEnchantments = [];
        for (const customEnchantmentKey of customEnchantments) {
            availableEnchantments.push(FishingCustomEnchantmentType[customEnchantmentKey]);
        }
        return availableEnchantments;
    }
}
