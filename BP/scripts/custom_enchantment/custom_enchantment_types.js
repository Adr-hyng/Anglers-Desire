export class FishingCustomEnchantmentType {
    static get Flamekissed() { return { name: "Flame Kissed", level: 1, conflicts: ["Treasure Calls"] }; }
    static get Thunderbite() { return { name: "Thunderbite", level: 1 }; }
    static get TreasureCalls() { return { name: "Treasure Calls", level: 1, conflicts: ["Flame Kissed"] }; }
}
export class CustomEnchantmentTypes {
    static get(customEnchantmentType) {
        const customEnchant = this.getAll().filter((enchantment) => enchantment.name === customEnchantmentType.name)[0];
        customEnchant.level = customEnchantmentType.level ?? 1;
        return customEnchant;
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
