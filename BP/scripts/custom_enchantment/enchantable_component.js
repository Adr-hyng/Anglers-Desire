import { ItemEnchantableComponent } from '@minecraft/server';
import { overrideEverything } from 'overrides/index';
import { OverTakes } from "overrides/partial_overtakes";
import { CustomEnchantmentTypes } from './custom_enchantment_types';
import { RomanNumericConverter } from 'utils/roman_converter';
import { CustomEnchantment } from './custom_enchantment';
overrideEverything();
OverTakes(ItemEnchantableComponent.prototype, {
    override(sourceItem) {
        this.source = sourceItem;
        if (!this.source)
            throw "No Itemstack source found in custom enchantment component";
        return this;
    },
    addCustomEnchantment(enchantment) {
        if (!this.source)
            throw "No Itemstack source found in custom enchantment component";
        if (!CustomEnchantmentTypes.get(enchantment))
            throw "Custom Enchantment not implemented yet";
        if (!this.hasCustomEnchantments()) {
            const enchantmentInfo = `§r§7${enchantment.name} ${RomanNumericConverter.toRoman(enchantment.level)}`;
            this.source.setLore([...this.source.getLore(), enchantmentInfo]);
            enchantment.create(this.source);
            return true;
        }
        if (this.hasConflicts(enchantment.name))
            return false;
        if (!this.hasCustomEnchantment(enchantment)) {
            const enchantmentInfo = `§r§7${enchantment.name} ${RomanNumericConverter.toRoman(enchantment.level)}`;
            this.source.setLore([...this.source.getLore(), enchantmentInfo]);
            enchantment.create(this.source);
            return true;
        }
        const currentEnchantment = this.getCustomEnchantment(enchantment);
        if (currentEnchantment.level < enchantment.level) {
            const enchantmentInfo = `§r§7${enchantment.name} ${RomanNumericConverter.toRoman(enchantment.level)}`;
            this.source.setLore([...this.source.getLore().filter(lore => !(lore.startsWith(`§r§7${enchantment.name}`))), enchantmentInfo]);
            enchantment.create(this.source);
            return true;
        }
        return false;
    },
    hasCustomEnchantment(enchantment) {
        if (!this.source)
            throw "No Itemstack source found in custom enchantment component";
        return this.source.hasLore(`§r§7${enchantment.name}`);
    },
    hasCustomEnchantments() {
        if (!this.source)
            throw "No Itemstack source found in custom enchantment component";
        return this.source.getLore().some(lore => (/(§r§7.*?)([IVXLCDM]+)$/).test(lore));
    },
    hasConflicts(enchantmentName) {
        return this.getCustomEnchantments().some(enchant => enchant.conflicts?.includes(enchantmentName));
    },
    canAddCustomEnchantment() {
        let canBeEnchanted = false;
        const AllValidCustomEnchantments = new Set();
        const AcquiredCustomEnchantments = new Set();
        for (const validCustomEnchantment of CustomEnchantmentTypes.getAll()) {
            AllValidCustomEnchantments.add(validCustomEnchantment.name);
        }
        for (const validCustomEnchantment of this.getCustomEnchantments()) {
            AcquiredCustomEnchantments.add(validCustomEnchantment.name);
        }
        for (const currentAvailableEnchantment of AllValidCustomEnchantments) {
            if (!AcquiredCustomEnchantments.has(currentAvailableEnchantment) && this.hasConflicts(currentAvailableEnchantment)) {
                return true;
            }
        }
        return canBeEnchanted;
    },
    getCustomEnchantment(enchantment) {
        if (!this.source)
            throw "No Itemstack source found in custom enchantment component";
        const index = this.source.getLore().findIndex(lore => lore.startsWith(`§r§7${enchantment.name}`));
        if (index === -1)
            return null;
        const [_, name, level] = this.source.getLore()[index].match(new RegExp(`(§r§7.*?)([IVXLCDM]+)$`));
        if (!name)
            throw "extraction error with regex in custom enchantment";
        const currentCustomEnchantment = CustomEnchantment.from({
            name: enchantment.name,
            level: RomanNumericConverter.toNumeric(level),
            conflicts: enchantment.conflicts,
        });
        currentCustomEnchantment.init(this.source);
        const fetchedCustomEnchantment = CustomEnchantmentTypes.get(currentCustomEnchantment);
        return fetchedCustomEnchantment;
    },
    getCustomEnchantments() {
        if (!this.source)
            throw "No Itemstack source found in custom enchantment component";
        const availableEnchantments = [];
        const ValidCustomEnchantments = this.source.getLore().filter(lore => new RegExp(/(§r§7.*?)([IVXLCDM]+)$/).test(lore)) || [];
        for (const validLore of ValidCustomEnchantments) {
            let [, eName, level] = validLore.match(/(§r§7.*?)([IVXLCDM]+)$/);
            const currentCustomEnchantment = CustomEnchantmentTypes.get(CustomEnchantment.from({
                name: eName.replace("§r§7", "").slice(0, -1),
                level: RomanNumericConverter.toNumeric(level),
            }));
            currentCustomEnchantment.init(this.source);
            availableEnchantments.push(currentCustomEnchantment);
        }
        return availableEnchantments;
    },
    removeCustomEnchantment(enchantment) {
        if (!this.source)
            throw "No Itemstack source found in custom enchantment component";
        this.source.setLore(this.source.getLore().filter(lore => !(lore.startsWith(`§r§7${enchantment.name}`))));
    }
});
