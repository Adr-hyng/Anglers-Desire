import { ItemStack } from "@minecraft/server";

export type TCustomEnchantment = {
  id?: string;
  name: string;
  level: number;
  usage?: number;
  maxUsage?: number;
  conflicts?: string[];
  dynamicPropId?: string;
}

// To make it efficient, use caching to not get dynamic property always, just use it if it did change the mainhand equipment.

export class CustomEnchantment {
  id?: string;
  private source: ItemStack;
  private _usage: number;
  private _maxUsage: number;
  private _dynamicPropertyIdentifier: string;
  name: string;
  level: number;
  conflicts?: string[];

  constructor(
    name: string, 
    level: number,
    conflicts?: string[], 
    maxUsage?: number,
    usage?: number,
    id?: string, 
    dynamicPropId?: string,
  ) {
    this.id = id;
    this.name = name;
    this.level = level;
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
      this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}Usage`, undefined);
      this.source.setDynamicProperty(`Fishing${this._dynamicPropertyIdentifier}MaxUsage`, undefined);
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

  static from(ref: TCustomEnchantment) {
    return new CustomEnchantment(ref.name, ref.level, ref.conflicts, ref.maxUsage, ref.usage, ref.id, ref.dynamicPropId);
  }
}