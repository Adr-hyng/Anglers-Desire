import { MyCustomItemTypes } from "fishing_system/items/custom_items";
import { CustomEnchantment } from "./custom_enchantment";
export class FishingCustomEnchantmentType {
    static get Nautilus() {
        return CustomEnchantment.from({
            id: MyCustomItemTypes.NautilusHook,
            name: "Nautilus Hook",
            dynamicPropId: "Nautilus",
            level: 1,
            maxUsage: 68,
            conflicts: ["Pyroclasm Hook"],
        });
    }
    static get Luminous() {
        return CustomEnchantment.from({
            id: MyCustomItemTypes.LuminousHook,
            name: "Luminous Hook",
            dynamicPropId: "Luminous",
            level: 1,
            maxUsage: 54,
        });
    }
    static get Pyroclasm() {
        return CustomEnchantment.from({
            id: MyCustomItemTypes.PyroclasmHook,
            name: "Pyroclasm Hook",
            dynamicPropId: "Pyroclasm",
            level: 1,
            maxUsage: 40,
            conflicts: ["Nautilus Hook"],
        });
    }
    static get Tempus() {
        return CustomEnchantment.from({
            id: MyCustomItemTypes.TempusHook,
            name: "Tempus Hook",
            dynamicPropId: "Tempus",
            level: 1,
            maxUsage: 89
        });
    }
    static get FermentedEye() {
        return CustomEnchantment.from({
            id: MyCustomItemTypes.FermentedSpiderEyeHook,
            name: "Hook With Fermented Spider Eye",
            dynamicPropId: "FermentedEye",
            level: 1,
            maxUsage: 35
        });
    }
}
export class CustomEnchantmentTypes {
    static get(customEnchantmentType) {
        const allAvailableCustomEnchantments = this.CachedAvailableEnchantments.length ? this.CachedAvailableEnchantments : this.getAll();
        const customEnchant = allAvailableCustomEnchantments.filter((enchantment) => enchantment.name === customEnchantmentType.name)[0];
        customEnchant.level = customEnchantmentType.level ?? 1;
        return customEnchant;
    }
    static getAll() {
        if (!this.CachedAvailableEnchantments.length) {
            const customEnchantments = Object.getOwnPropertyNames(FishingCustomEnchantmentType).filter((prop) => !(['length', 'name', 'prototype'].includes(prop)));
            const availableEnchantments = [];
            for (const customEnchantmentKey of customEnchantments) {
                availableEnchantments.push(FishingCustomEnchantmentType[customEnchantmentKey]);
            }
            this.CachedAvailableEnchantments = availableEnchantments;
        }
        return this.CachedAvailableEnchantments;
    }
    static getAllAsProperties() {
        if (!this.CachedImplementedEnchantments.size) {
            const ImplementedEnchantments = Object.getOwnPropertyNames(FishingCustomEnchantmentType).filter((prop) => !(['length', 'name', 'prototype'].includes(prop)));
            this.CachedImplementedEnchantments = new Set(ImplementedEnchantments);
            return ImplementedEnchantments;
        }
        return this.CachedImplementedEnchantments;
    }
}
CustomEnchantmentTypes.CachedAvailableEnchantments = [];
