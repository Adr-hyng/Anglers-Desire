import { ItemStack } from "@minecraft/server";
import { generateUUID16 } from "utils/utilities";

export type TCustomEnchantment = {
  itemID?: string;
  name: string;
  level: number;
  usage?: number;
  maxUsage?: number;
  conflicts?: string[];
  id?: string;
  icon?: string;
  description?: string;
  lore?: string;
}

const extractDynamicPropertyID = (input: string): string | null => {
  // Regular expression to match the pattern
  const regex = /yn:AD_[a-fA-F0-9]{8}_[a-zA-Z0-9]+/;
  
  // Execute the regex on the input string
  const match = input.match(regex);
  
  // Return the matched string or null if not found
  return match ? match[0] : null;
};

export class CustomEnchantment {
  itemID?: string;
  private source: ItemStack;
  _usage: number;
  _dynamicPropID: string;
  maxUsage: number;
  id: string;
  name: string;
  level: number;
  description: string;
  lore: string;
  conflicts?: string[];
  icon: string;

  constructor({
    name,
    level,
    conflicts = [],
    maxUsage,
    usage,
    itemID,
    id,
    icon,
    description,
    lore,
  }: TCustomEnchantment) {
    this.icon = icon;
    this.itemID = itemID;
    this.name = name;
    this.level = level;
    this.description = description;
    this.lore = lore;
    this.conflicts = conflicts ?? [];
    this.maxUsage = maxUsage;
    this._usage = usage ?? maxUsage;
    this.id = id;
    // this.dynamicPropID = `AD_${generateUUID16(8)}${id}`;
  }

  damageUsage(decrementedValue: number = 1): boolean {
    if(!this.source) throw "Source of Itemstack doesn't exists in Custom Enchantment in damageUsage method";
    this._usage = this.usage;
    this._usage -= decrementedValue;
    if(this._usage <= 1) {
      this.source.enchantment.override(this.source).removeCustomEnchantment(this);
      return true;
    }
    this.source.setDynamicProperty(`${this.dynamicPropID}Usage`, this._usage);
    return false;
  }

  get usage() {
    if(!this.source) throw "Source of Itemstack doesn't exists in Custom Enchantment in usage getter";
    // It keeps changing the dynamicProp
    // It should stay, whenever there's already a dynamic property with the format.
    this._usage = (this.source.getDynamicProperty(`${this.dynamicPropID}Usage`) as number); 
    return this._usage;
  }

  set usage(newUsage: number) {
    this.usage = newUsage;
  }

  get dynamicPropID(): string {
    const pattern = new RegExp(`^AD_\\w{8}_${this.id}*(Usage)$`, 'gm');
    const dynamicPropertyId = this.source.getDynamicPropertyIds();
    if(!dynamicPropertyId.length) return `AD_${generateUUID16(8)}_${this.id}`;
    const customEnchantmentDynamicPropertyIDs = dynamicPropertyId.filter(prop => pattern.test(prop));
    if(!customEnchantmentDynamicPropertyIDs.length) return `AD_${generateUUID16(8)}_${this.id}`;
    const existing = customEnchantmentDynamicPropertyIDs[0].replace(/(Usage)/, "");
    this._dynamicPropID = existing;
    return this._dynamicPropID; 
  }

  create(source: ItemStack) {
    this.init(source);    
    this.source.setDynamicProperty(`${this.dynamicPropID}Usage`, this.maxUsage);
    return this;
  }

  init(source: ItemStack) {
    this.source = source;
    return this;
  }

  remove() {
    if(!this.source) throw "Source of Itemstack doesn't exists in Custom Enchantment in remove method";
    this.source.setDynamicProperty(`${this.dynamicPropID}Usage`, undefined);
  }

  clone() {
    return new CustomEnchantment({
      name: this.name,
      level: this.level,
      conflicts: this.conflicts,
      description: this.description,
      icon: this.icon,
      id: this.id,
      itemID: this.itemID,
      lore: this.lore,
      maxUsage: this.maxUsage,
      usage: this.maxUsage
    });
  }
}