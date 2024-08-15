import { EnchantmentSlot, Dimension, ItemStack, ItemComponentTypes, EnchantmentType, EntityTypes } from '@minecraft/server';
import { randomEnchantByLevel } from 'enchantment_system/enchantment_table';
import { OverTakes } from "./partial_overtakes";
import { Logger, Random } from 'utils/index';
import { MinecraftItemTypes } from 'vanilla-types/index';
OverTakes(Dimension.prototype, {
    spawnLoot(loot, location) {
        try {
            let spawnedItems = [];
            const rollPools = Random.weighted();
            const rollEntries = Random.weighted();
            if (!loot.pools.length)
                throw new Error("loot: loot pools is empty");
            for (const pool of loot.pools) {
                rollPools.addEntry(pool, pool.weight ?? 100);
            }
            const pool = rollPools.getRandom();
            if (!pool?.rolls)
                throw new Error(`/'rolls/' is missing at pools[${loot.pools.indexOf(pool)}]`);
            if (pool.rolls <= 0)
                throw new Error(`>>rolls: ${pool.rolls}<< is very low, it should be at least 1, at pools[${loot.pools.indexOf(pool)}]`);
            pool.rolls = typeof pool.rolls === "number" ? pool.rolls : typeof pool.rolls === "object" ? Math.floor(Math.random() * (pool.rolls.max - pool.rolls.min + 1)) + pool.rolls.min : 1;
            for (let i = 0; i < pool.rolls; i++) {
                for (const entry of pool.entries) {
                    if (!entry?.item)
                        return;
                    if (!entry?.weight)
                        continue;
                    let count = typeof entry.count === "number" ? entry.count : typeof entry.count === "object" ? Math.floor(Math.random() * (entry.count.max - entry.count.min + 1)) + entry.count.min : 1;
                    if (count <= 0)
                        continue;
                    const item = new ItemStack(`${entry.item}`, count);
                    item?.setCanDestroy(entry?.setCanDestroy);
                    item?.setCanPlaceOn(entry?.setCanPlaceOn);
                    item.nameTag = entry?.setName;
                    item?.setLore(entry?.setLore);
                    if (entry?.setDurability && item?.getComponents().length) {
                        const durabilityComponent = item.getComponent(ItemComponentTypes.Durability);
                        const maxDurability = durabilityComponent.maxDurability;
                        let durability;
                        if (typeof entry.setDurability === 'number') {
                            durability = entry.setDurability * maxDurability;
                        }
                        else if (typeof entry.setDurability === 'object') {
                            const minPercentage = entry.setDurability.min;
                            const maxPercentage = entry.setDurability.max;
                            const randomPercentage = Math.random() * (maxPercentage - minPercentage) + minPercentage;
                            durability = randomPercentage * maxDurability;
                        }
                        else {
                            durability = maxDurability;
                        }
                        const damage = maxDurability - durability;
                        item.getComponent(ItemComponentTypes.Durability).damage = (damage + 0.5) | 0;
                    }
                    if (entry?.setEnchantments && item?.getComponents().length) {
                        entry.setEnchantments.forEach((enchantment) => {
                            const enchantToAdd = { type: new EnchantmentType(`${enchantment.name}`), level: 0 };
                            const lvl = typeof enchantment.level === 'number' ? (enchantment.level <= enchantToAdd.type.maxLevel ? enchantment.level : enchantToAdd.type.maxLevel) : typeof enchantment.level === 'object' ? Math.floor(Math.random() * (enchantment.level.max - enchantment.level.min + 1)) + enchantment.level.min : 1;
                            const enchantments = item.getComponent(ItemComponentTypes.Enchantable);
                            enchantToAdd.level = lvl ?? enchantToAdd.type.maxLevel;
                            if (enchantments.canAddEnchantment(enchantToAdd))
                                item.getComponent(ItemComponentTypes.Enchantable).addEnchantment(enchantToAdd);
                        });
                    }
                    if (entry?.setEnchantWithLevels && item?.getComponents().length) {
                        const _enchantment = entry.setEnchantWithLevels;
                        const enchantments = item.getComponent(ItemComponentTypes.Enchantable);
                        let materialType;
                        let equipmentType;
                        switch (enchantments.slots.includes(enchantments.slots[0]) && enchantments.slots.length === 1 ? enchantments.slots[0] : "UnimplementedSlot") {
                            case EnchantmentSlot.ArmorFeet:
                                materialType = ((input) => {
                                    const match = [...input.matchAll(/(\w+):(\w+)_boots/g)].map(match => match[2])[0];
                                    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
                                })(item.typeId);
                                equipmentType = 'ArmorFeet';
                                break;
                            case EnchantmentSlot.ArmorHead:
                                materialType = ((input) => {
                                    const match = [...input.matchAll(/(\w+):(\w+)_helmet/g)].map(match => match[2])[0];
                                    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
                                })(item.typeId);
                                equipmentType = 'ArmorHead';
                                break;
                            case EnchantmentSlot.ArmorLegs:
                                materialType = ((input) => {
                                    const match = [...input.matchAll(/(\w+):(\w+)_leggings/g)].map(match => match[2])[0];
                                    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
                                })(item.typeId);
                                equipmentType = 'ArmorLegs';
                                break;
                            case EnchantmentSlot.ArmorTorso:
                                materialType = ((input) => {
                                    const match = [...input.matchAll(/(\w+):(\w+)_chestplate/g)].map(match => match[2])[0];
                                    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
                                })(item.typeId);
                                equipmentType = 'ArmorTorso';
                                break;
                            case EnchantmentSlot.Bow:
                                materialType = 'Others';
                                equipmentType = 'Bow';
                                break;
                            case EnchantmentSlot.Crossbow:
                                materialType = 'Others';
                                equipmentType = 'Crossbow';
                                break;
                            case EnchantmentSlot.FishingRod:
                                materialType = 'Others';
                                equipmentType = 'FishingRod';
                                break;
                            case EnchantmentSlot.Sword:
                                materialType = ((input) => {
                                    const match = [...input.matchAll(/(\w+):(\w+)_sword/g)].map(match => match[2])[0];
                                    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
                                })(item.typeId);
                                equipmentType = 'Sword';
                                break;
                            case EnchantmentSlot.Axe:
                                materialType = ((input) => {
                                    const match = [...input.matchAll(/(\w+):(\w+)_axe/g)].map(match => match[2])[0];
                                    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
                                })(item.typeId);
                                equipmentType = 'Tool';
                                break;
                            case EnchantmentSlot.Hoe:
                                materialType = ((input) => {
                                    const match = [...input.matchAll(/(\w+):(\w+)_hoe/g)].map(match => match[2])[0];
                                    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
                                })(item.typeId);
                                equipmentType = 'Tool';
                                break;
                            case EnchantmentSlot.Shovel:
                                materialType = ((input) => {
                                    const match = [...input.matchAll(/(\w+):(\w+)_shovel/g)].map(match => match[2])[0];
                                    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
                                })(item.typeId);
                                equipmentType = 'Tool';
                                break;
                            case EnchantmentSlot.Pickaxe:
                                materialType = ((input) => {
                                    const match = [...input.matchAll(/(\w+):(\w+)_pickaxe/g)].map(match => match[2])[0];
                                    return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
                                })(item.typeId);
                                equipmentType = 'Tool';
                                break;
                            case EnchantmentSlot.Shears:
                                materialType = 'Others';
                                equipmentType = 'Tool';
                                break;
                            case EnchantmentSlot.CarrotStick:
                                materialType = 'Others';
                                equipmentType = 'Equipment';
                                break;
                            case EnchantmentSlot.Flintsteel:
                                materialType = 'Others';
                                equipmentType = 'Equipment';
                                break;
                            case EnchantmentSlot.Shield:
                                materialType = 'Others';
                                equipmentType = 'Equipment';
                                break;
                            case EnchantmentSlot.Elytra:
                                materialType = 'Others';
                                equipmentType = 'Equipment';
                                break;
                            case EnchantmentSlot.CosmeticHead:
                                materialType = 'Others';
                                equipmentType = 'Miscellaneous';
                                break;
                            case EnchantmentSlot.Spear:
                                materialType = 'Others';
                                equipmentType = 'Trident';
                                break;
                            default:
                                if (item.typeId === MinecraftItemTypes.Mace) {
                                    materialType = 'Mace';
                                    equipmentType = 'Mace';
                                }
                                else if (item.typeId === MinecraftItemTypes.EnchantedBook) {
                                    materialType = 'Others';
                                    equipmentType = 'EnchantmentBook';
                                }
                                else {
                                    materialType = 'Others';
                                    equipmentType = 'Miscellaneous';
                                }
                                break;
                        }
                        _enchantment.level = (typeof _enchantment.level === 'number' ? _enchantment.level : typeof _enchantment.level === 'object' ? (Math.floor(Math.random() * (_enchantment.level.max - _enchantment.level.min + 1)) + _enchantment.level.min) : 1);
                        const selectedEnchantments = randomEnchantByLevel(_enchantment.level, materialType, equipmentType);
                        for (const e of selectedEnchantments) {
                            const enchant = { type: e, level: e.power ?? 1 };
                            if (!enchantments.canAddEnchantment(enchant))
                                continue;
                            item.getComponent(ItemComponentTypes.Enchantable).addEnchantment(enchant);
                        }
                    }
                    if (entry?.toEntity && Boolean(EntityTypes.get(entry.toEntity) !== undefined)) {
                        item.asEntity = entry.toEntity;
                    }
                    rollEntries.addEntry(item, entry.weight);
                }
            }
            for (let i = 0; i < pool.rolls; i++) {
                const entityToSpawn = rollEntries.getRandom();
                if (entityToSpawn?.asEntity) {
                    spawnedItems.push(this.spawnEntity(entityToSpawn.asEntity, location));
                }
                else {
                    spawnedItems.push(this.spawnItem(entityToSpawn, location));
                }
            }
            return spawnedItems;
        }
        catch (e) {
            Logger.error(e, e.stack);
            return [];
        }
    }
});
