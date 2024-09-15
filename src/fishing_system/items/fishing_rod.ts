import { Enchantment, ItemComponentTypes, ItemDurabilityComponent, ItemEnchantableComponent, ItemStack, Player } from "@minecraft/server";
import { EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";
import { MinecraftEnchantmentTypes, MinecraftItemTypes} from "vanilla-types/index";
import { OverTakes } from "overrides/partial_overtakes";
import { HookUpgrades } from "fishing_system/upgrades/upgrades";

declare module "@minecraft/server" {
  interface EntityEquippableComponent {
    get equipment(): ItemStack;
    getLuckOfSea(): Enchantment | undefined;
    getLure(): Enchantment | undefined;
    /**
    * This function damage a durability, then returns if item just broke due to low durability, or it did not broke.
    * @param equipment tool/equipment to reduce durability.
    * @param damageApplied amount of durability deducted to the tool/equipment.
    * @returns {boolean}
    */
    damageDurability(damageApplied: number): boolean;
    get isEquipped(): boolean;
    get upgrade(): HookUpgrades;
  }
}

OverTakes(EntityEquippableComponent.prototype, {
  get equipment() {
    return this.getEquipment(EquipmentSlot.Mainhand);
  },
  get upgrade() {
    return new HookUpgrades(this.equipment);
  },
  get isEquipped() {
    return (this.equipment?.typeId === MinecraftItemTypes.FishingRod);
  },
  getLuckOfSea(): Enchantment | undefined {
    if(!this.equipment) return;
    const enchantments = (this.equipment.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent);
    return enchantments.hasEnchantment(MinecraftEnchantmentTypes.LuckOfTheSea) ? enchantments.getEnchantment(MinecraftEnchantmentTypes.LuckOfTheSea) : undefined;
  },
  getLure(): Enchantment | undefined {
    if(!this.equipment) return;
    const enchantments = (this.equipment.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent);
    return enchantments.hasEnchantment(MinecraftEnchantmentTypes.Lure) ? enchantments.getEnchantment(MinecraftEnchantmentTypes.Lure) : undefined;
  },
  damageDurability(damageApplied: number): boolean {
    const equipmentToDamage: ItemStack = this.getEquipment(EquipmentSlot.Mainhand) as ItemStack;
    if(!equipmentToDamage) return false;
    const player = this.entity as Player;
    if(!player.isSurvival()) return false;
    if(!equipmentToDamage?.hasComponent(ItemComponentTypes.Durability)) throw "Item doesn't have durability to damage with";
    let level: number = 0;
    const itemDurability: ItemDurabilityComponent = (equipmentToDamage.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent);
    if(equipmentToDamage.hasComponent(ItemComponentTypes.Enchantable)) {
      const enchantment = equipmentToDamage.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent;
      if(enchantment.hasEnchantment(MinecraftEnchantmentTypes.Unbreaking)) level = enchantment.getEnchantment(MinecraftEnchantmentTypes.Unbreaking).level;
    }
    for(const customEnchantment of equipmentToDamage.enchantment.override(equipmentToDamage).getCustomEnchantments()) {
      if(customEnchantment.damageUsage()) player.playSound("random.break", {volume: 0.5, pitch: 0.7});
    }

    const unbreakingMultiplier: number = (100 / (level + 1)) / 100;
    const unbreakingDamage: number = damageApplied * unbreakingMultiplier;
    if(itemDurability.damage + unbreakingDamage >= itemDurability.maxDurability){
      this.setEquipment(EquipmentSlot.Mainhand, undefined);
      player.playSound("random.break");
      return true;
    } else if(itemDurability.damage + unbreakingDamage < itemDurability.maxDurability){
      (equipmentToDamage.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent).damage += unbreakingDamage;
      this.setEquipment(EquipmentSlot.Mainhand, equipmentToDamage);

      return false;
    }
  }
});