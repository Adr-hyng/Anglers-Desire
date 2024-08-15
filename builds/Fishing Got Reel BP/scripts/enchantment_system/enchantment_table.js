import { Random } from "utils/Random/random";
import { Enchantability } from "enchantment_system/index";
function GetModifiedLevel(baseEnchantLevel, materialType, equipmentType) {
    const enchantability = Enchantability.get(materialType, equipmentType);
    const firstModifier = Random.randomInt(0, enchantability >> 2) + 1;
    let _baseEnchantLevel = baseEnchantLevel;
    _baseEnchantLevel += firstModifier;
    const secondModifier = Random.randomFloat(0.85, 1.15);
    _baseEnchantLevel = (_baseEnchantLevel * secondModifier + 0.5) | 0;
    return _baseEnchantLevel;
}
function GetPossibleEnchantments(modifiedLevel, equipmentType) {
    const possibleEnchantments = new Set();
    const enchantmentsForItem = Enchantability[equipmentType];
    for (const equipmentEnchantment of enchantmentsForItem) {
        let maxEnchantmentPower = 0;
        for (let [currentEnchantmentPower, { min: minLevel, max: maxLevel }] of equipmentEnchantment.range.entries()) {
            if (minLevel <= modifiedLevel && modifiedLevel <= maxLevel)
                maxEnchantmentPower = currentEnchantmentPower + 1 > maxEnchantmentPower
                    ? currentEnchantmentPower + 1 : maxEnchantmentPower;
        }
        equipmentEnchantment.power = maxEnchantmentPower;
        possibleEnchantments.add(equipmentEnchantment);
    }
    return possibleEnchantments;
}
function SelectRelevantEnchantments(modifiedLevel, possibleEnchantments) {
    const selectedEnchantment = new Set();
    const enchantmentWeights = Random.weighted();
    for (const enchantment of possibleEnchantments) {
        enchantmentWeights.addEntry(enchantment, enchantment.weight);
    }
    let selected = enchantmentWeights.getRandom();
    selectedEnchantment.add(selected);
    let keepGoingChance = (modifiedLevel + 1) / 50;
    let randomStopChance = Math.random();
    while (randomStopChance < keepGoingChance) {
        for (const enchantment of possibleEnchantments) {
            if (enchantment.power === 0 || selected.conflicts.includes(enchantment.id)) {
                if (!enchantmentWeights.removeEntry(enchantment))
                    continue;
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
export function randomEnchantByLevel(baseEnchantLevel, materialType, equipmentType) {
    const modifiedLevel = GetModifiedLevel(baseEnchantLevel, materialType, equipmentType);
    const possibleEnchantments = GetPossibleEnchantments(modifiedLevel, equipmentType);
    const selectedEnchantments = SelectRelevantEnchantments(modifiedLevel, possibleEnchantments);
    return selectedEnchantments;
}
