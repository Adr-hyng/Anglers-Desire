import { EnchantmentRangeHandler } from "./enchantment_range_handler";
import { ItemMaterial } from "./material_types";
export class Enchantability {
    static get(itemType, materialType) {
        const match = materialType.match(/^Armor/);
        let equipmentType = "Tool";
        if (match)
            equipmentType = "Armor";
        return ItemMaterial[itemType][equipmentType] ?? 1;
    }
    static get ArmorFeet() {
        return [
            EnchantmentRangeHandler.DepthStrider,
            EnchantmentRangeHandler.FeatherFalling,
            EnchantmentRangeHandler.FrostWalker,
            EnchantmentRangeHandler.SoulSpeed,
            EnchantmentRangeHandler.Binding,
            ...this.Equipment,
        ];
    }
    static get ArmorLegs() {
        return [
            EnchantmentRangeHandler.SwiftSneak,
            EnchantmentRangeHandler.Binding,
            ...this.Equipment,
        ];
    }
    static get ArmorHead() {
        return [
            EnchantmentRangeHandler.AquaAffinity,
            EnchantmentRangeHandler.Respiration,
            EnchantmentRangeHandler.Binding,
            ...this.Equipment,
        ];
    }
    static get ArmorTorso() {
        return [
            EnchantmentRangeHandler.Protection,
            EnchantmentRangeHandler.FireProtection,
            EnchantmentRangeHandler.BlastProtection,
            EnchantmentRangeHandler.ProjectileProtection,
            EnchantmentRangeHandler.Thorns,
            EnchantmentRangeHandler.Binding,
            ...this.Equipment,
        ];
    }
    static get Sword() {
        return [
            EnchantmentRangeHandler.Sharpness,
            EnchantmentRangeHandler.Smite,
            EnchantmentRangeHandler.BaneOfArthropods,
            EnchantmentRangeHandler.Knockback,
            EnchantmentRangeHandler.FireAspect,
            EnchantmentRangeHandler.Looting,
            ...this.Equipment
        ];
    }
    static get Mace() {
        return [
            EnchantmentRangeHandler.Density,
            EnchantmentRangeHandler.Breach,
            ...this.Equipment
        ];
    }
    static get Tool() {
        return [
            EnchantmentRangeHandler.Efficiency,
            EnchantmentRangeHandler.SilkTouch,
            EnchantmentRangeHandler.Fortune,
            EnchantmentRangeHandler.Smite,
            EnchantmentRangeHandler.BaneOfArthropods,
            EnchantmentRangeHandler.Sharpness,
            ...this.Equipment,
        ];
    }
    static get Bow() {
        return [
            EnchantmentRangeHandler.Power,
            EnchantmentRangeHandler.Punch,
            EnchantmentRangeHandler.Flame,
            EnchantmentRangeHandler.Infinity,
            ...this.Equipment,
        ];
    }
    static get FishingRod() {
        return [
            EnchantmentRangeHandler.LuckOfTheSea,
            EnchantmentRangeHandler.Lure,
            ...this.Equipment,
        ];
    }
    static get Trident() {
        return [
            EnchantmentRangeHandler.Channeling,
            EnchantmentRangeHandler.Impaling,
            EnchantmentRangeHandler.Loyalty,
            EnchantmentRangeHandler.Riptide,
            ...this.Equipment,
        ];
    }
    static get Crossbow() {
        return [
            EnchantmentRangeHandler.Multishot,
            EnchantmentRangeHandler.Piercing,
            EnchantmentRangeHandler.QuickCharge,
            ...this.Equipment,
        ];
    }
    static get Equipment() {
        return [
            EnchantmentRangeHandler.Unbreaking,
            EnchantmentRangeHandler.Mending,
            ...this.Miscellaneous,
        ];
    }
    static get Miscellaneous() {
        return [
            EnchantmentRangeHandler.Vanishing,
        ];
    }
    static get EnchantmentBook() {
        return EnchantmentRangeHandler.getAll();
    }
}
