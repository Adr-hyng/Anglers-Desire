import { MyCustomItemTypes } from "fishing_system/items/custom_items";
import { CustomEnchantment } from "./custom_enchantment";
export class FishingCustomEnchantmentType {
    static get Nautilus() {
        return CustomEnchantment.from({
            id: MyCustomItemTypes.NautilusHook,
            name: "Nautilus Hook",
            level: 1,
            maxUsage: 50,
            conflicts: ["Pyroclasm Hook"]
        });
    }
    static get LuminousSiren() {
        return CustomEnchantment.from({
            id: MyCustomItemTypes.LuminousHook,
            name: "Luminous Siren Hook",
            level: 1,
            maxUsage: 50
        });
    }
    static get Pyroclasm() {
        return CustomEnchantment.from({
            id: MyCustomItemTypes.PyroclasmHook,
            name: "Pyroclasm Hook",
            level: 1,
            maxUsage: 50,
            conflicts: ["Nautilus Hook"]
        });
    }
    static get Tempus() {
        return CustomEnchantment.from({
            id: MyCustomItemTypes.TempusHook,
            name: "Tempus Hook",
            level: 1,
            maxUsage: 50
        });
    }
    static get FermentedSpiderEyeHook() {
        return CustomEnchantment.from({
            id: MyCustomItemTypes.FermentedSpiderEyeHook,
            name: "Hook With Fermented Spider Eye",
            level: 1,
            maxUsage: 50
        });
    }
    static getAll() {
        return Object.getOwnPropertyNames(this).filter((prop) => !(['length', 'name', 'prototype', 'getAll'].includes(prop)));
    }
}
export class CustomEnchantmentTypes {
    static get(customEnchantmentType) {
        const customEnchant = this.getAll().filter((enchantment) => enchantment.name === customEnchantmentType.name)[0];
        customEnchant.level = customEnchantmentType.level ?? 1;
        return customEnchant;
    }
    static getAll() {
        if (!this.CachedAvailableEnchantments.length) {
            const customEnchantments = FishingCustomEnchantmentType.getAll();
            const availableEnchantments = [];
            for (const customEnchantmentKey of customEnchantments) {
                availableEnchantments.push(FishingCustomEnchantmentType[customEnchantmentKey]);
            }
            this.CachedAvailableEnchantments = availableEnchantments;
            return availableEnchantments;
        }
        return this.CachedAvailableEnchantments;
    }
}
CustomEnchantmentTypes.CachedAvailableEnchantments = [];
