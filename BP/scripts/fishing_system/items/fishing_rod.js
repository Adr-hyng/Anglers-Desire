import { ItemComponentTypes } from "@minecraft/server";
import { EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";
import { MinecraftEnchantmentTypes, MinecraftItemTypes } from "vanilla-types/index";
import { OverTakes } from "overrides/partial_overtakes";
import { HookUpgrades } from "fishing_system/upgrades/upgrades";
const fishingRodUpgradesMap = new WeakMap();
OverTakes(EntityEquippableComponent.prototype, {
    get upgrade() {
        const player = this.entity;
        const itemStack = this.getEquipmentSlot(EquipmentSlot.Mainhand).getItem();
        let rodUpgradeMap = fishingRodUpgradesMap.get(player);
        if (!rodUpgradeMap)
            fishingRodUpgradesMap.set(player, rodUpgradeMap = new HookUpgrades(itemStack));
        return rodUpgradeMap;
    },
    get isEquipped() {
        this.equipment = this.getEquipment(EquipmentSlot.Mainhand);
        return (this.equipment?.typeId === MinecraftItemTypes.FishingRod);
    },
    getLuckOfSea() {
        const itemStack = this.getEquipmentSlot(EquipmentSlot.Mainhand).getItem();
        const enchantments = itemStack.getComponent(ItemComponentTypes.Enchantable);
        return enchantments.hasEnchantment(MinecraftEnchantmentTypes.LuckOfTheSea) ? enchantments.getEnchantment(MinecraftEnchantmentTypes.LuckOfTheSea) : undefined;
    },
    getLure() {
        const itemStack = this.getEquipmentSlot(EquipmentSlot.Mainhand).getItem();
        const enchantments = itemStack.getComponent(ItemComponentTypes.Enchantable);
        return enchantments.hasEnchantment(MinecraftEnchantmentTypes.Lure) ? enchantments.getEnchantment(MinecraftEnchantmentTypes.Lure) : undefined;
    },
    damageDurability(damageApplied) {
        const equipmentToDamage = this.getEquipment(EquipmentSlot.Mainhand);
        const player = this.entity;
        if (!player.isSurvival)
            return false;
        if (!equipmentToDamage.hasComponent(ItemComponentTypes.Durability))
            throw "Item doesn't have durability to damage with";
        let level = 0;
        const itemDurability = equipmentToDamage.getComponent(ItemComponentTypes.Durability);
        if (equipmentToDamage.hasComponent(ItemComponentTypes.Enchantable)) {
            const enchantment = equipmentToDamage.getComponent(ItemComponentTypes.Enchantable);
            if (enchantment.hasEnchantment(MinecraftEnchantmentTypes.Unbreaking))
                level = enchantment.getEnchantment(MinecraftEnchantmentTypes.Unbreaking).level;
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
