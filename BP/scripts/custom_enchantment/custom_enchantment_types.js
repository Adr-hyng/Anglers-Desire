import { MyCustomItemTypes } from "fishing_system/items/custom_items";
export class FishingCustomEnchantmentType {
    static get Nautilus() { return { id: MyCustomItemTypes.NautilusHook, name: "Nautilus Hook", level: 1, conflicts: ["Pyroclasm Hook"] }; }
    static get LuminousSiren() { return { id: MyCustomItemTypes.LuminousHook, name: "Luminous Siren Hook", level: 1 }; }
    static get Pyroclasm() { return { id: MyCustomItemTypes.PyroclasmHook, name: "Pyroclasm Hook", level: 1, conflicts: ["Nautilus Hook"] }; }
    static get Tempus() { return { id: MyCustomItemTypes.TempusHook, name: "Tempus Hook", level: 1 }; }
    static get FermentedSpiderEyeHook() { return { id: MyCustomItemTypes.FermentedSpiderEyeHook, name: "Hook With Fermented Spider Eye", level: 1 }; }
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
