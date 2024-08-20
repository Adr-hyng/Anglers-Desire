import { ItemEnchantableComponent } from '@minecraft/server';
import { overrideEverything } from 'overrides/index';
import { OverTakes } from "overrides/partial_overtakes";
import { CustomEnchantmentTypes } from './custom_enchantment_types';
overrideEverything();
OverTakes(ItemEnchantableComponent.prototype, {
    override(sourceItem) {
        this.source = sourceItem;
        return this;
    },
    addCustomEnchantment(enchantment) {
        if (!CustomEnchantmentTypes.get(enchantment))
            throw "Custom Enchantment not implemented yet";
        if (this.hasCustomEnchantment(enchantment))
            return;
        const enchantmentInfo = `§r§7${enchantment.name} ${enchantment.level}`;
        this.source.setLore([...this.source.getLore(), enchantmentInfo]);
    },
    hasCustomEnchantment(enchantment) {
        return this.source.hasLore(`§r§7${enchantment.name} ${enchantment.level}`);
    },
});
