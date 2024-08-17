import { EnchantmentRangeHandler } from "./enchantment_range_handler";
import { ItemMaterial } from "./material_types";
import { EnchantmentType } from "@minecraft/server";

type EquipmentCategory = "Armor" | "Tool";
export type ItemMaterialType = Exclude<keyof typeof ItemMaterial, "prototype">;

export class Enchantability {

  static get( itemType: ItemMaterialType, materialType: EquipmentMaterialType): number{
      const match = materialType.match(/^Armor/);
      let equipmentType: EquipmentCategory = "Tool";
      if (match) equipmentType = "Armor";
      return ItemMaterial[itemType][equipmentType] ?? 1;
  }

  static get ArmorFeet(): EnchantmentType[] { return [
      EnchantmentRangeHandler.DepthStrider,
      EnchantmentRangeHandler.FeatherFalling,
      EnchantmentRangeHandler.FrostWalker,
      EnchantmentRangeHandler.SoulSpeed,
      EnchantmentRangeHandler.Binding,
      ...this.Equipment,
  ];}
  static get ArmorLegs(): EnchantmentType[] { return [
      EnchantmentRangeHandler.SwiftSneak,
      EnchantmentRangeHandler.Binding,
      ...this.Equipment,
  ];}
  static get ArmorHead(): EnchantmentType[] { return [
      EnchantmentRangeHandler.AquaAffinity,
      EnchantmentRangeHandler.Respiration,
      EnchantmentRangeHandler.Binding,
      ...this.Equipment,
  ];}
  static get ArmorTorso(): EnchantmentType[] {return [
      EnchantmentRangeHandler.Protection,
      EnchantmentRangeHandler.FireProtection,
      EnchantmentRangeHandler.BlastProtection,
      EnchantmentRangeHandler.ProjectileProtection,
      EnchantmentRangeHandler.Thorns,
      EnchantmentRangeHandler.Binding,
      ...this.Equipment,
  ];}
  static get Sword(): EnchantmentType[] { return [
      EnchantmentRangeHandler.Sharpness,
      EnchantmentRangeHandler.Smite,
      EnchantmentRangeHandler.BaneOfArthropods,
      EnchantmentRangeHandler.Knockback,
      EnchantmentRangeHandler.FireAspect,
      EnchantmentRangeHandler.Looting,
      ...this.Equipment
  ];}
  static get Mace(): EnchantmentType[] { return [
      EnchantmentRangeHandler.Density,
      EnchantmentRangeHandler.Breach,
      ...this.Equipment
  ];}
  static get Tool(): EnchantmentType[] {return [
      EnchantmentRangeHandler.Efficiency,
      EnchantmentRangeHandler.SilkTouch,
      EnchantmentRangeHandler.Fortune,
      EnchantmentRangeHandler.Smite,
      EnchantmentRangeHandler.BaneOfArthropods,
      EnchantmentRangeHandler.Sharpness,
      ...this.Equipment,
  ];}
  static get Bow(): EnchantmentType[] { return [
      EnchantmentRangeHandler.Power,
      EnchantmentRangeHandler.Punch,
      EnchantmentRangeHandler.Flame,
      EnchantmentRangeHandler.Infinity,
      ...this.Equipment,
  ];}
  static get FishingRod(): EnchantmentType[] {return [
      EnchantmentRangeHandler.LuckOfTheSea,
      EnchantmentRangeHandler.Lure,
      ...this.Equipment,
  ];}
  static get Trident(): EnchantmentType[] {return [
      EnchantmentRangeHandler.Channeling,
      EnchantmentRangeHandler.Impaling,
      EnchantmentRangeHandler.Loyalty,
      EnchantmentRangeHandler.Riptide,
      ...this.Equipment,
  ];}
  static get Crossbow(): EnchantmentType[] {return [
      EnchantmentRangeHandler.Multishot,
      EnchantmentRangeHandler.Piercing,
      EnchantmentRangeHandler.QuickCharge,
      ...this.Equipment,
  ];}
  static get Equipment(): EnchantmentType[] { return [
      EnchantmentRangeHandler.Unbreaking,
      EnchantmentRangeHandler.Mending,
      ...this.Miscellaneous,
  ];}
  
  static get Miscellaneous(): EnchantmentType[] { return [
      EnchantmentRangeHandler.Vanishing,
  ];}

  static get EnchantmentBook(): EnchantmentType[] {
      return EnchantmentRangeHandler.getAll().filter((e)=> !([EnchantmentRangeHandler.SwiftSneak.id, EnchantmentRangeHandler.SoulSpeed.id, EnchantmentRangeHandler.WindBurst.id].includes(e.id))).map(en => en);
    //   return EnchantmentRangeHandler.getAll();
  }
}

export type MinecraftEnchantabilityTypesUnion = keyof typeof Enchantability;
export type EquipmentMaterialType = Exclude<keyof typeof Enchantability, "prototype" | "get">;