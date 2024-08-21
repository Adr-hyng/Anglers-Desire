
import { ItemEnchantableComponent, ItemStack } from '@minecraft/server';
import { overrideEverything } from 'overrides/index';
import { OverTakes } from "overrides/partial_overtakes";
import { CustomEnchantment, CustomEnchantmentTypes } from './custom_enchantment_types';
overrideEverything();

declare module "@minecraft/server" {
  interface ItemEnchantableComponent {
    /**
     * Make sure this exists, else it will error.
     */
    source: ItemStack;
    override(sourceItem: ItemStack): this;
    addCustomEnchantment(enchantment: CustomEnchantment): void;
    hasCustomEnchantment(enchantment: CustomEnchantment): boolean;
    hasCustomEnchantments(): boolean;
    getCustomEnchantment(enchantment: CustomEnchantment): CustomEnchantment;
    getCustomEnchantments(): CustomEnchantment[];
  }
}

OverTakes(ItemEnchantableComponent.prototype, {
  override(sourceItem: ItemStack) {
    this.source = sourceItem;
    if(!this.source) throw "No Itemstack source found in custom enchantment component";
    return this;
  },
  addCustomEnchantment(enchantment: CustomEnchantment): void {
    if(!CustomEnchantmentTypes.get(enchantment)) throw "Custom Enchantment not implemented yet";

    // Check all enchants this have, if it has conflicts, if it has then return
    if(this.hasCustomEnchantments()) {
      // Get all the custom enchantments this item has to check for conclicts
      const customEnchantments = this.getCustomEnchantments();

      // There's a conflict, then return
      if(customEnchantments.some(enchant => enchant.conflicts?.includes(enchantment.name))) return;

      // Override the existing when the highest level
      if(this.hasCustomEnchantment(enchantment)) { 
        const currentEnchantment = this.getCustomEnchantment(enchantment);
        if(currentEnchantment.level < enchantment.level) {
          const enchantmentInfo = `§r§7${enchantment.name} ${enchantment.level}`;
          this.source.setLore([...this.source.getLore().filter(lore => !(lore.startsWith(`§r§7${enchantment.name}`))), enchantmentInfo])
        }
      }
      else {
        const enchantmentInfo = `§r§7${enchantment.name} ${enchantment.level}`;
        this.source.setLore([...this.source.getLore(), enchantmentInfo]);
      }
    } else {
      // First time getting enchantment
      const enchantmentInfo = `§r§7${enchantment.name} ${enchantment.level}`;
      this.source.setLore([...this.source.getLore(), enchantmentInfo]);
    }
  },
  hasCustomEnchantment(enchantment: CustomEnchantment): boolean {
    return this.source.hasLore(`§r§7${enchantment.name}`);
  },
  hasCustomEnchantments(): boolean {
    return this.source.getLore().some(lore => (/(§r§7.*\D)(\d+)$/).test(lore));
  },
  getCustomEnchantment(enchantment: CustomEnchantment): CustomEnchantment {
    const index = this.source.getLore().findIndex(lore => lore.startsWith(`§r§7${enchantment.name}`)); 
    if(index === -1) return;
    const [_, name, level] = this.source.getLore()[index].match(new RegExp(`(§r§7${enchantment.name})\\s*(\\d+)$`));
    if(!name) throw "extraction error with regex in custom enchantment"
    const fetchedCustomEnchantment = CustomEnchantmentTypes.get({name: enchantment.name, level: parseInt(level), conflicts: enchantment.conflicts});
    return fetchedCustomEnchantment;
  },
  getCustomEnchantments(): CustomEnchantment[] {
    // Filter only some valid custom enchantments using the custom enchant format
    const availableEnchantments: CustomEnchantment[] = [];
    const ValidCustomEnchantments: string[] = this.source.getLore().filter(lore => new RegExp(/(§r§7.*\D)(\d+)$/).test(lore)) || [];
    for (const validLore of ValidCustomEnchantments) {
      let [, eName, level] = validLore.match(/(§r§7.*\D)(\d+)$/);
      availableEnchantments.push( CustomEnchantmentTypes.get({name: eName.replace("§r§7", "").slice(0, -1), level: parseInt(level)}) );
    }
    return availableEnchantments;
  }
});