import { ItemComponentTypes } from "@minecraft/server";
import { EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";
import { MinecraftEnchantmentTypes, MinecraftItemTypes } from "vanilla-types/index";
import { OverTakes } from "overrides/partial_overtakes";
import { HookUpgrades } from "fishing_system/upgrades/upgrades";
OverTakes(EntityEquippableComponent.prototype, {
    get equipment() {
        return this.getEquipment(EquipmentSlot.Mainhand);
    },
    get upgrade() {
        return new HookUpgrades(this.equipment);
    },
    get isEquipped() {
        return (this.equipment?.typeId === MinecraftItemTypes.FishingRod);
    },
    getLuckOfSea() {
        const enchantments = this.equipment.getComponent(ItemComponentTypes.Enchantable);
        return enchantments.hasEnchantment(MinecraftEnchantmentTypes.LuckOfTheSea) ? enchantments.getEnchantment(MinecraftEnchantmentTypes.LuckOfTheSea) : undefined;
    },
    getLure() {
        const enchantments = this.equipment.getComponent(ItemComponentTypes.Enchantable);
        return enchantments.hasEnchantment(MinecraftEnchantmentTypes.Lure) ? enchantments.getEnchantment(MinecraftEnchantmentTypes.Lure) : undefined;
    },
    damageDurability(damageApplied) {
        const equipmentToDamage = this.getEquipment(EquipmentSlot.Mainhand);
        const player = this.entity;
        if (!player.isSurvival)
            return false;
        if (!equipmentToDamage?.hasComponent(ItemComponentTypes.Durability))
            throw "Item doesn't have durability to damage with";
        let level = 0;
        const itemDurability = equipmentToDamage.getComponent(ItemComponentTypes.Durability);
        if (equipmentToDamage.hasComponent(ItemComponentTypes.Enchantable)) {
            const enchantment = equipmentToDamage.getComponent(ItemComponentTypes.Enchantable);
            if (enchantment.hasEnchantment(MinecraftEnchantmentTypes.Unbreaking))
                level = enchantment.getEnchantment(MinecraftEnchantmentTypes.Unbreaking).level;
        }
        try {
            for (const customEnchantment of equipmentToDamage.enchantment.override(equipmentToDamage).getCustomEnchantments()) {
                if (customEnchantment.damageUsage())
                    player.playSound("random.break", { volume: 0.5, pitch: 0.7 });
            }
        }
        catch (e) {
            console.warn(e, e.stack);
        }
        const unbreakingMultiplier = (100 / (level + 1)) / 100;
        const unbreakingDamage = damageApplied * unbreakingMultiplier;
        if (itemDurability.damage + unbreakingDamage >= itemDurability.maxDurability) {
            this.setEquipment(EquipmentSlot.Mainhand, undefined);
            player.playSound("random.break");
            return true;
        }
        else if (itemDurability.damage + unbreakingDamage < itemDurability.maxDurability) {
            equipmentToDamage.getComponent(ItemComponentTypes.Durability).damage += unbreakingDamage;
            this.setEquipment(EquipmentSlot.Mainhand, equipmentToDamage);
            return false;
        }
    }
});
