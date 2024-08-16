
import { Enchantment, EnchantmentSlot, Dimension, Vector3, Entity, ItemStack, ItemComponentTypes, ItemDurabilityComponent, ItemEnchantableComponent, EnchantmentType, EntityTypes } from '@minecraft/server';
import { randomEnchantByLevel} from 'enchantment_system/enchantment_table';
import { OverTakes } from "./partial_overtakes";
import { Logger, Random } from 'utils/index';
import { RangeInternal, LootTableType, PollsTableType} from 'types/index';
import { EquipmentMaterialType, ItemMaterialType } from 'enchantment_system/enchantability';
import { MinecraftEntityTypes, MinecraftItemTypes } from 'vanilla-types/index';

/**
  loot: a variable similar to JSON loot_tables.
  location: Vector3, the location where the loot will spawn.
*/
declare module "@minecraft/server" {
  interface Dimension {
    spawnLoot(loot: LootTableType, location: Vector3): Entity[];
  }
}


OverTakes(Dimension.prototype, {
  spawnLoot(loot: LootTableType, location: Vector3): Entity[] {
    try {
      let spawnedItems: Entity[] = [];
      const rollPools = Random.weighted<PollsTableType>();
      const rollEntries = Random.weighted<ItemStack>();

      if(!loot.pools.length) throw new Error("loot: loot pools is empty");

      for(const pool of loot.pools) {
        rollPools.addEntry(pool, pool.weight ?? 100);
      }
      
      const pool: PollsTableType = rollPools.getRandom();
      // Some errors in case rolls does not exist or is <= 0
      if(!pool?.rolls) throw new Error(`/'rolls/' is missing at pools[${loot.pools.indexOf(pool)}]`);
      if((pool.rolls as number) <= 0) throw new Error(`>>rolls: ${pool.rolls}<< is very low, it should be at least 1, at pools[${loot.pools.indexOf(pool)}]`);
      pool.rolls = typeof pool.rolls === "number" ? pool.rolls : typeof pool.rolls === "object" ? Math.floor(Math.random()*(pool.rolls.max - pool.rolls.min +1)) + pool.rolls.min : 1;
      
      // Repeat the loot table according to the number of rolls
      for(let i = 0; i < pool.rolls; i++) {
        for(const entry of pool.entries) {
          // Returns if entry does not have an item
          if(!entry?.item) return;
          if(!entry?.weight) continue;

          // Gets the itemStack and count, returns if count <= 0.
          let count: number = typeof entry.count === "number" ? entry.count : typeof entry.count === "object" ? Math.floor(Math.random()*(entry.count.max - entry.count.min +1)) + entry.count.min : 1;
          if(count <= 0) continue;
          const item: ItemStack = new ItemStack(`${entry.item}`, count);
          // Sets optional item parameters
          item?.setCanDestroy(entry?.setCanDestroy);
          item?.setCanPlaceOn(entry?.setCanPlaceOn);
          item.nameTag = entry?.setName;
          item?.setLore(entry?.setLore);
          // set durability
          if (entry?.setDurability && item?.getComponents().length) {
            const durabilityComponent = item.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent;
            const maxDurability = durabilityComponent.maxDurability;
            let durability: number;
            if (typeof entry.setDurability === 'number') {
              durability = entry.setDurability * maxDurability;
            } else if (typeof entry.setDurability === 'object') {
              const minPercentage = entry.setDurability.min;
              const maxPercentage = entry.setDurability.max;
              const randomPercentage = Math.random() * (maxPercentage - minPercentage) + minPercentage;
              durability = randomPercentage * maxDurability;
            } else {
              durability = maxDurability; // or any default value you choose
            }
            const damage = maxDurability - durability;
            (item.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent).damage = (damage + 0.5) | 0;
          }

          // set enchantments by specific
          if(entry?.setEnchantments && item?.getComponents().length) {
            entry.setEnchantments.forEach((enchantment) => {
              const enchantToAdd = {type: new EnchantmentType(`${enchantment.name}`), level: 0} as Enchantment;
              const lvl: number = typeof enchantment.level === 'number' ? (enchantment.level <= enchantToAdd.type.maxLevel ? enchantment.level : enchantToAdd.type.maxLevel) : typeof enchantment.level === 'object' ? Math.floor(Math.random()*(enchantment.level.max - enchantment.level.min +1)) + enchantment.level.min : 1;
              const enchantments = item.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent;
              enchantToAdd.level = lvl ?? enchantToAdd.type.maxLevel;
              if(enchantments.canAddEnchantment(enchantToAdd)) (item.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment(enchantToAdd);
            });
          }

          // set random enchants by level
          if(entry?.setEnchantWithLevels && item?.getComponents().length) {
            const _enchantment = entry.setEnchantWithLevels; 
            const enchantments = item.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent;
            let materialType: ItemMaterialType;
            let equipmentType: EquipmentMaterialType;
            switch(enchantments.slots.includes(enchantments.slots[0]) && enchantments.slots.length === 1 ? enchantments.slots[0] : "UnimplementedSlot") {
              case EnchantmentSlot.ArmorFeet:
                materialType = ((input: string): string => {
                  const match = [...input.matchAll(/(\w+):(\w+)_boots/g)].map(match => match[2])[0];
                  return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
                })(item.typeId) as ItemMaterialType;
                equipmentType = 'ArmorFeet';
                break;
              case EnchantmentSlot.ArmorHead:
                materialType = ((input: string): string => {
                  const match = [...input.matchAll(/(\w+):(\w+)_helmet/g)].map(match => match[2])[0];
                  return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
                })(item.typeId) as ItemMaterialType;
                equipmentType = 'ArmorHead';
                break;
              case EnchantmentSlot.ArmorLegs:
                materialType = ((input: string): string => {
                  const match = [...input.matchAll(/(\w+):(\w+)_leggings/g)].map(match => match[2])[0];
                  return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
                })(item.typeId) as ItemMaterialType;
                equipmentType = 'ArmorLegs';
                break;
              case EnchantmentSlot.ArmorTorso:
                materialType = ((input: string): string => {
                  const match = [...input.matchAll(/(\w+):(\w+)_chestplate/g)].map(match => match[2])[0];
                  return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
                })(item.typeId) as ItemMaterialType;
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
                materialType = ((input: string): string => {
                  const match = [...input.matchAll(/(\w+):(\w+)_sword/g)].map(match => match[2])[0];
                  return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
                })(item.typeId) as ItemMaterialType;
                equipmentType = 'Sword';
                break;
              case EnchantmentSlot.Axe:
                materialType = ((input: string): string => {
                  const match = [...input.matchAll(/(\w+):(\w+)_axe/g)].map(match => match[2])[0];
                  return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
                })(item.typeId) as ItemMaterialType;
                equipmentType = 'Tool';
                break;
              case EnchantmentSlot.Hoe:
                materialType = ((input: string): string => {
                  const match = [...input.matchAll(/(\w+):(\w+)_hoe/g)].map(match => match[2])[0];
                  return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
                })(item.typeId) as ItemMaterialType;
                equipmentType = 'Tool';
                break;
              case EnchantmentSlot.Shovel:
                materialType = ((input: string): string => {
                  const match = [...input.matchAll(/(\w+):(\w+)_shovel/g)].map(match => match[2])[0];
                  return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
                })(item.typeId) as ItemMaterialType;
                equipmentType = 'Tool';
                break;
              case EnchantmentSlot.Pickaxe:
                materialType = ((input: string): string => {
                  const match = [...input.matchAll(/(\w+):(\w+)_pickaxe/g)].map(match => match[2])[0];
                  return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
                })(item.typeId) as ItemMaterialType;
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
                if(item.typeId === MinecraftItemTypes.Mace){
                  materialType = 'Mace';
                  equipmentType = 'Mace';
                } else if (item.typeId === MinecraftItemTypes.EnchantedBook) {
                  materialType = 'Others';
                  equipmentType = 'EnchantmentBook';
                } else {
                  materialType = 'Others';
                  equipmentType = 'Miscellaneous';
                }
                break;
            }
            _enchantment.level = (typeof _enchantment.level === 'number' ? _enchantment.level : typeof _enchantment.level === 'object' ? (Math.floor(Math.random()*(_enchantment.level.max - _enchantment.level.min +1)) + _enchantment.level.min) : 1) as RangeInternal<1, 31>;
            const selectedEnchantments = randomEnchantByLevel(_enchantment.level, materialType, equipmentType);
            for(const e of selectedEnchantments) {
              const enchant: Enchantment = {type: e, level: e.power ?? 1};
              if(!enchantments.canAddEnchantment(enchant)) continue;
              (item.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment(enchant);
            }
          }

          // check if it's summonable
          if(entry?.toEntity && Boolean(EntityTypes.get(entry.toEntity) !== undefined)) {
            item.asEntity = entry.toEntity;
          }

          // Spawns the item at the specified location.
          rollEntries.addEntry(item, entry.weight);
        }
      }

      // Random Weighted Selection
      for(let i = 0; i < pool.rolls; i++) {
        const entityToSpawn: ItemStack = rollEntries.getRandom();
        if(entityToSpawn?.asEntity) {
          spawnedItems.push( this.spawnEntity(entityToSpawn.asEntity, {x: location.x, y: location.y - 0.8, z: location.z}) );
        } else {
          spawnedItems.push( this.spawnItem(entityToSpawn, location) );
        }
      }
      return spawnedItems; // List of Entity
    } catch (e) {
      Logger.error(e, e.stack);
      return [];
    }
  }
});