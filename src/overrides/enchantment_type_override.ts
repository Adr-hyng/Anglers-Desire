
import { 
  EnchantmentType} from '@minecraft/server';
import { OverTakes } from "overrides/partial_overtakes";
import { UniformRange } from 'types/range_type';

declare module "@minecraft/server" {
  interface EnchantmentType {
    weight: number;
    conflicts?: string[];
    range: UniformRange[];
    power: number;
    setProperty(weight: number, range: UniformRange[], conflicts?: string[]): EnchantmentType;
  }
}


OverTakes(EnchantmentType.prototype, {
  setProperty(weight: number, range: UniformRange[], conflicts?: string[]): EnchantmentType {
    this.weight = weight;
    this.range = range;
    this.conflicts = conflicts ?? [];
    return this;
  },  
});