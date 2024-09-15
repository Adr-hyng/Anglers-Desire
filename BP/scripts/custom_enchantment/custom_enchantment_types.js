import { FishingCustomEnchantmentType } from "./available_custom_enchantments";
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
                availableEnchantments.push(FishingCustomEnchantmentType[customEnchantmentKey].clone());
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
