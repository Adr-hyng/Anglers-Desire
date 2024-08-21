import { ItemEnchantableComponent } from '@minecraft/server';
import { overrideEverything } from 'overrides/index';
import { OverTakes } from "overrides/partial_overtakes";
import { CustomEnchantmentTypes } from './custom_enchantment_types';
import { RomanNumericConverter } from 'utils/utilities';
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
            return;
        }
        if (this.getCustomEnchantments().some(enchant => enchant.conflicts?.includes(enchantment.name)))
            return;
        if (!this.hasCustomEnchantment(enchantment)) {
            const enchantmentInfo = `§r§7${enchantment.name} ${RomanNumericConverter.toRoman(enchantment.level)}`;
            this.source.setLore([...this.source.getLore(), enchantmentInfo]);
            return;
        }
        const currentEnchantment = this.getCustomEnchantment(enchantment);
        if (currentEnchantment.level < enchantment.level) {
            const enchantmentInfo = `§r§7${enchantment.name} ${RomanNumericConverter.toRoman(enchantment.level)}`;
            this.source.setLore([...this.source.getLore().filter(lore => !(lore.startsWith(`§r§7${enchantment.name}`))), enchantmentInfo]);
        }
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
    getCustomEnchantment(enchantment) {
        if (!this.source)
            throw "No Itemstack source found in custom enchantment component";
        const index = this.source.getLore().findIndex(lore => lore.startsWith(`§r§7${enchantment.name}`));
        if (index === -1)
            return;
        const [_, name, level] = this.source.getLore()[index].match(new RegExp(`(§r§7.*?)([IVXLCDM]+)$`));
        if (!name)
            throw "extraction error with regex in custom enchantment";
        const fetchedCustomEnchantment = CustomEnchantmentTypes.get({ name: enchantment.name, level: RomanNumericConverter.toNumeric(level), conflicts: enchantment.conflicts });
        return fetchedCustomEnchantment;
    },
    getCustomEnchantments() {
        if (!this.source)
            throw "No Itemstack source found in custom enchantment component";
        const availableEnchantments = [];
        const ValidCustomEnchantments = this.source.getLore().filter(lore => new RegExp(/(§r§7.*?)([IVXLCDM]+)$/).test(lore)) || [];
        for (const validLore of ValidCustomEnchantments) {
            let [, eName, level] = validLore.match(/(§r§7.*?)([IVXLCDM]+)$/);
            availableEnchantments.push(CustomEnchantmentTypes.get({ name: eName.replace("§r§7", "").slice(0, -1), level: RomanNumericConverter.toNumeric(level) }));
        }
        return availableEnchantments;
    }
});
