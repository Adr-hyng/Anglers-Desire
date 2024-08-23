
import { ItemEnchantableComponent, ItemStack } from '@minecraft/server';
import { overrideEverything } from 'overrides/index';
import { OverTakes } from "overrides/partial_overtakes";
import { CustomEnchantment, CustomEnchantmentTypes } from './custom_enchantment_types';
import { RomanNumericConverter } from 'utils/utilities';
overrideEverything();

declare module "@minecraft/server" {
  interface ItemEnchantableComponent {
    /**
     * Make sure this exists, else it will error.
     */
    source: ItemStack;
    override(sourceItem: ItemStack): this;
    /**
     * returns if it successfully added.
     */
    addCustomEnchantment(enchantment: CustomEnchantment): boolean;
    hasCustomEnchantment(enchantment: CustomEnchantment): boolean;
    hasCustomEnchantments(): boolean;
    hasConflicts(enchantmentName: string): boolean;
    canAddCustomEnchantment(): boolean;
    getCustomEnchantment(enchantment: CustomEnchantment): CustomEnchantment;
    getCustomEnchantments(): CustomEnchantment[];
    removeCustomEnchantment(enchantment: CustomEnchantment): void;
  }
}

OverTakes(ItemEnchantableComponent.prototype, {
  override(sourceItem: ItemStack) {
    this.source = sourceItem;
    if(!this.source) throw "No Itemstack source found in custom enchantment component";
    return this;
  },
  addCustomEnchantment(enchantment: CustomEnchantment): boolean {
    if(!this.source) throw "No Itemstack source found in custom enchantment component";
    if(!CustomEnchantmentTypes.get(enchantment)) throw "Custom Enchantment not implemented yet";
    if(!this.hasCustomEnchantments()) {
      const enchantmentInfo = `§r§7${enchantment.name} ${RomanNumericConverter.toRoman(enchantment.level)}`;
      this.source.setLore([...this.source.getLore(), enchantmentInfo]);
      return true;
    }

    if(this.hasConflicts(enchantment.name)) return false;
    if(!this.hasCustomEnchantment(enchantment)) {
      const enchantmentInfo = `§r§7${enchantment.name} ${RomanNumericConverter.toRoman(enchantment.level)}`;
      this.source.setLore([...this.source.getLore(), enchantmentInfo]);
      return true;
    }
    
    const currentEnchantment = this.getCustomEnchantment(enchantment);
    if(currentEnchantment.level < enchantment.level) {
      const enchantmentInfo = `§r§7${enchantment.name} ${RomanNumericConverter.toRoman(enchantment.level)}`;
      this.source.setLore([...this.source.getLore().filter(lore => !(lore.startsWith(`§r§7${enchantment.name}`))), enchantmentInfo])
      return true;
    }
    return false;
  },
  hasCustomEnchantment(enchantment: CustomEnchantment): boolean {
    if(!this.source) throw "No Itemstack source found in custom enchantment component";
    return this.source.hasLore(`§r§7${enchantment.name}`);
  },
  hasCustomEnchantments(): boolean {
    if(!this.source) throw "No Itemstack source found in custom enchantment component";
    return this.source.getLore().some(lore => (/(§r§7.*?)([IVXLCDM]+)$/).test(lore));
  },
  hasConflicts(enchantmentName: string): boolean {
    return this.getCustomEnchantments().some(enchant => enchant.conflicts?.includes(enchantmentName));
  },
  canAddCustomEnchantment(): boolean {
    let canBeEnchanted = false;
    const AllValidCustomEnchantments: Set<string> = new Set();
    const AcquiredCustomEnchantments: Set<string> = new Set();

    for(const validCustomEnchantment of CustomEnchantmentTypes.getAll()) {
      AllValidCustomEnchantments.add(validCustomEnchantment.name);
    }
    for(const validCustomEnchantment of this.getCustomEnchantments()) {
      AcquiredCustomEnchantments.add(validCustomEnchantment.name);
    }
    for(const currentAvailableEnchantment of AllValidCustomEnchantments) {
      if(!AcquiredCustomEnchantments.has(currentAvailableEnchantment) && this.hasConflicts(currentAvailableEnchantment)) {
        return true;
      }
    }
    return canBeEnchanted;
  },
  getCustomEnchantment(enchantment: CustomEnchantment): CustomEnchantment {
    if(!this.source) throw "No Itemstack source found in custom enchantment component";
    const index = this.source.getLore().findIndex(lore => lore.startsWith(`§r§7${enchantment.name}`)); 
    if(index === -1) return null;
    const [_, name, level] = this.source.getLore()[index].match(new RegExp(`(§r§7.*?)([IVXLCDM]+)$`));
    if(!name) throw "extraction error with regex in custom enchantment"
    const fetchedCustomEnchantment = CustomEnchantmentTypes.get({name: enchantment.name, level: RomanNumericConverter.toNumeric(level), conflicts: enchantment.conflicts});
    return fetchedCustomEnchantment;
  },
  getCustomEnchantments(): CustomEnchantment[] {
    if(!this.source) throw "No Itemstack source found in custom enchantment component";
    const availableEnchantments: CustomEnchantment[] = [];
    const ValidCustomEnchantments: string[] = this.source.getLore().filter(lore => new RegExp(/(§r§7.*?)([IVXLCDM]+)$/).test(lore)) || [];
    for (const validLore of ValidCustomEnchantments) {
      let [, eName, level] = validLore.match(/(§r§7.*?)([IVXLCDM]+)$/);
      availableEnchantments.push( CustomEnchantmentTypes.get({name: eName.replace("§r§7", "").slice(0, -1), level: RomanNumericConverter.toNumeric(level)}) );
    }
    return availableEnchantments;
  },
  removeCustomEnchantment(enchantment: CustomEnchantment): void {
    if(!this.source) throw "No Itemstack source found in custom enchantment component";
    this.source.setLore(this.source.getLore().filter(lore => !(lore.startsWith(`§r§7${enchantment.name}`)) ));
  }
});