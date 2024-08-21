export class FishingCustomEnchantmentType {
    static get Nautilus() { return { name: "Nautilus Hook", level: 1, conflicts: ["Pyroclasm Hook"] }; }
    static get LuminousSiren() { return { name: "Luminous Siren Hook", level: 1 }; }
    static get Pyroclasm() { return { name: "Pyroclasm Hook", level: 1, conflicts: ["Nautilus Hook"] }; }
    static get Tempus() { return { name: "Tempus Hook", level: 1 }; }
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
