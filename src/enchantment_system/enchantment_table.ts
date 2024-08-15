import { EnchantmentType } from "@minecraft/server";
import { Random } from "utils/Random/random";
import { RangeInternal } from "types/index";
import { Enchantability, EquipmentMaterialType, ItemMaterialType} from "enchantment_system/index";

function GetModifiedLevel(baseEnchantLevel: RangeInternal<1, 31>, materialType: ItemMaterialType, equipmentType: EquipmentMaterialType): number {
  const enchantability: number = Enchantability.get(materialType, equipmentType);
  const firstModifier: number = Random.randomInt(0, enchantability >> 2) + 1;
  let _baseEnchantLevel: number = baseEnchantLevel;
  _baseEnchantLevel += firstModifier;

  const secondModifier: number = Random.randomFloat(0.85, 1.15);
  _baseEnchantLevel = (_baseEnchantLevel * secondModifier + 0.5) | 0;
  return _baseEnchantLevel;
}

function GetPossibleEnchantments(modifiedLevel: number, equipmentType: EquipmentMaterialType): Set<EnchantmentType> {
  const possibleEnchantments: Set<EnchantmentType> = new Set();
  const enchantmentsForItem: EnchantmentType[] = (Enchantability[equipmentType] as EnchantmentType[]);
  for (const equipmentEnchantment of enchantmentsForItem) {
    let maxEnchantmentPower: number = 0;
    for(let [currentEnchantmentPower, {min: minLevel, max: maxLevel}] of equipmentEnchantment.range.entries()) {
      if(minLevel <= modifiedLevel && modifiedLevel <= maxLevel) maxEnchantmentPower = currentEnchantmentPower + 1 > maxEnchantmentPower
      ? currentEnchantmentPower + 1 : maxEnchantmentPower;
    }
    equipmentEnchantment.power = maxEnchantmentPower;
    possibleEnchantments.add(equipmentEnchantment);
  }
  return possibleEnchantments;
}

function SelectRelevantEnchantments(modifiedLevel: number, possibleEnchantments: Set<EnchantmentType>): Set<EnchantmentType> {
  const selectedEnchantment: Set<EnchantmentType> = new Set();
  const enchantmentWeights = Random.weighted<EnchantmentType>();

  // Add weights to entries to be removed later.
  for(const enchantment of possibleEnchantments) {
    enchantmentWeights.addEntry(enchantment, enchantment.weight);
  }

  let selected: EnchantmentType = enchantmentWeights.getRandom();
  selectedEnchantment.add(selected);
  
  let keepGoingChance = (modifiedLevel + 1) / 50;
  let randomStopChance = Math.random();

  while(randomStopChance < keepGoingChance) {

    // Filter enchantments that have 0 enchantment power or have conflicts.
    for (const enchantment of possibleEnchantments) {
      if (enchantment.power === 0 || selected.conflicts.includes(enchantment.id)) {
        if(!enchantmentWeights.removeEntry(enchantment)) continue;
        possibleEnchantments.delete(enchantment);
      }
    }

    keepGoingChance = (modifiedLevel + 1) / 50;
    randomStopChance = Math.random();

    selected = enchantmentWeights.getRandom();
    selectedEnchantment.add(selected);

    modifiedLevel = modifiedLevel >> 1;
  }
  return selectedEnchantment;
}

export function randomEnchantByLevel(baseEnchantLevel: RangeInternal<1, 31>, materialType: ItemMaterialType, equipmentType: EquipmentMaterialType): Set<EnchantmentType> {
  const modifiedLevel: number = GetModifiedLevel(baseEnchantLevel, materialType, equipmentType);
  const possibleEnchantments: Set<EnchantmentType> = GetPossibleEnchantments(modifiedLevel, equipmentType);
  const selectedEnchantments: Set<EnchantmentType> = SelectRelevantEnchantments(modifiedLevel, possibleEnchantments);
  return selectedEnchantments;
}