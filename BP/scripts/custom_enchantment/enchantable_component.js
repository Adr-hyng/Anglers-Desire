import { ItemEnchantableComponent } from '@minecraft/server';
import { overrideEverything } from 'overrides/index';
import { OverTakes } from "overrides/partial_overtakes";
import { CustomEnchantmentTypes } from './custom_enchantment_types';
overrideEverything();
OverTakes(ItemEnchantableComponent.prototype, {
    override(sourceItem) {
        this.source = sourceItem;
        if (!this.source)
            throw "No Itemstack source found in custom enchantment component";
        return this;
    },
    addCustomEnchantment(enchantment) {
        if (!CustomEnchantmentTypes.get(enchantment))
            throw "Custom Enchantment not implemented yet";
        if (this.hasCustomEnchantments()) {
            const customEnchantments = this.getCustomEnchantments();
            if (customEnchantments.some(enchant => enchant.conflicts?.includes(enchantment.name)))
                return;
            if (this.hasCustomEnchantment(enchantment)) {
                const currentEnchantment = this.getCustomEnchantment(enchantment);
                if (currentEnchantment.level < enchantment.level) {
                    const enchantmentInfo = `§r§7${enchantment.name} ${enchantment.level}`;
                    this.source.setLore([...this.source.getLore().filter(lore => !(lore.startsWith(`§r§7${enchantment.name}`))), enchantmentInfo]);
                }
            }
            else {
                const enchantmentInfo = `§r§7${enchantment.name} ${enchantment.level}`;
                this.source.setLore([...this.source.getLore(), enchantmentInfo]);
            }
        }
        else {
            const enchantmentInfo = `§r§7${enchantment.name} ${enchantment.level}`;
            this.source.setLore([...this.source.getLore(), enchantmentInfo]);
        }
    },
    hasCustomEnchantment(enchantment) {
        return this.source.hasLore(`§r§7${enchantment.name}`);
    },
    hasCustomEnchantments() {
        return this.source.getLore().some(lore => (/(§r§7.*\D)(\d+)$/).test(lore));
    },
    getCustomEnchantment(enchantment) {
        const index = this.source.getLore().findIndex(lore => lore.startsWith(`§r§7${enchantment.name}`));
        if (index === -1)
            return;
        const [_, name, level] = this.source.getLore()[index].match(new RegExp(`(§r§7${enchantment.name})\\s*(\\d+)$`));
        if (!name)
            throw "extraction error with regex in custom enchantment";
        const fetchedCustomEnchantment = CustomEnchantmentTypes.get({ name: enchantment.name, level: parseInt(level), conflicts: enchantment.conflicts });
        return fetchedCustomEnchantment;
    },
    getCustomEnchantments() {
        const availableEnchantments = [];
        const ValidCustomEnchantments = this.source.getLore().filter(lore => new RegExp(/(§r§7.*\D)(\d+)$/).test(lore)) || [];
        for (const validLore of ValidCustomEnchantments) {
            let [, eName, level] = validLore.match(/(§r§7.*\D)(\d+)$/);
            availableEnchantments.push(CustomEnchantmentTypes.get({ name: eName.replace("§r§7", "").slice(0, -1), level: parseInt(level) }));
        }
        return availableEnchantments;
    }
});
