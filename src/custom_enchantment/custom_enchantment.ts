import { ItemStack } from "@minecraft/server";

export type TCustomEnchantment = {
  id?: string;
  name: string;
  level: number;
  usage?: number;
  maxUsage?: number;
  conflicts?: string[];
  dynamicPropId?: string;
  icon?: string;
  description?: string;
  lore?: string;
}

export class CustomEnchantment {
  id?: string;
  private source: ItemStack;
  private _usage: number;
  private _maxUsage: number;
  private _dynamicPropertyIdentifier: string;
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
    usage = maxUsage,
    id,
    dynamicPropId,
    icon,
    description,
    lore,
  }: TCustomEnchantment) {
    this.icon = icon;
    this.id = id;
    this.name = name;
    this.level = level;
    this.description = description;
    this.lore = lore;
    this.conflicts = conflicts ?? [];
    this._maxUsage = maxUsage;
    this._usage = usage ?? maxUsage;
    this._dynamicPropertyIdentifier = dynamicPropId;
  }

  damageUsage(decrementedValue: number = 1): boolean {
    if(!this.source) throw "Source of Itemstack doesn't exists in Custom Enchantment in Update method";
    this._usage = this.usage;
    this._usage -= decrementedValue;
    if(this._usage <= 1) {
      this.source.enchantment.override(this.source).removeCustomEnchantment(this);
      return true;
    }
    this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}Usage`, this._usage);
    return false;
  }

  get usage() {
    if(!this.source) throw "Source of Itemstack doesn't exists in Custom Enchantment in usage getter";
    this._usage = (this.source.getDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}Usage`) as number) ?? this._usage;
    return this._usage;
  }

  get maxUsage() {
    if(!this.source) throw "Source of Itemstack doesn't exists in Custom Enchantment in maxUsage getter";
    this._maxUsage = (this.source.getDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}MaxUsage`) as number) ?? this._maxUsage;
    return this._maxUsage;
  }

  create(source: ItemStack) {
    this.init(source);    
    this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}Usage`, this._usage);
    this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}MaxUsage`, this.maxUsage);
  }

  init(source: ItemStack) {
    this.source = source;
    this._usage = this.usage;
    this._maxUsage = this.maxUsage;
  }

  remove() {
    if(!this.source) throw "Source of Itemstack doesn't exists in Custom Enchantment in remove method";
    this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}Usage`, undefined);
    this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}MaxUsage`, undefined);
  }
}