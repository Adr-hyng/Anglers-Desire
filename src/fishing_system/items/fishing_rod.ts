import { Enchantment, ItemComponentTypes, ItemDurabilityComponent, ItemEnchantableComponent, ItemStack, Player } from "@minecraft/server";
import { EntityEquippableComponent, EquipmentSlot } from "@minecraft/server";
import { MinecraftEnchantmentTypes, MinecraftItemTypes} from "vanilla-types/index";
import { OverTakes } from "overrides/partial_overtakes";
import { HookUpgrades } from "fishing_system/upgrades/upgrades";

declare module "@minecraft/server" {
  interface EntityEquippableComponent {
    equipment: ItemStack;
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

const fishingRodUpgradesMap = new WeakMap<Player, HookUpgrades>();

OverTakes(EntityEquippableComponent.prototype, {
  get upgrade() {
    const player = this.entity;
    const itemStack = this.getEquipmentSlot(EquipmentSlot.Mainhand).getItem();
    let rodUpgradeMap = fishingRodUpgradesMap.get(player);
    if(!rodUpgradeMap) fishingRodUpgradesMap.set(player, rodUpgradeMap = new HookUpgrades(itemStack));
    return rodUpgradeMap;
  },
  get isEquipped() {
    this.equipment = this.getEquipment(EquipmentSlot.Mainhand);
    return (this.equipment?.typeId === MinecraftItemTypes.FishingRod);
  },
  getLuckOfSea(): Enchantment | undefined {
    const itemStack = this.getEquipmentSlot(EquipmentSlot.Mainhand).getItem();
    const enchantments = (itemStack.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent);
    return enchantments.hasEnchantment(MinecraftEnchantmentTypes.LuckOfTheSea) ? enchantments.getEnchantment(MinecraftEnchantmentTypes.LuckOfTheSea) : undefined;
  },
  getLure(): Enchantment | undefined {
    const itemStack = this.getEquipmentSlot(EquipmentSlot.Mainhand).getItem();
    const enchantments = (itemStack.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent);
    return enchantments.hasEnchantment(MinecraftEnchantmentTypes.Lure) ? enchantments.getEnchantment(MinecraftEnchantmentTypes.Lure) : undefined;
  },
  damageDurability(damageApplied: number): boolean {
    // IDK IF THIS ERRORS with items that doesn't have enchanmtnets or unbreaking enchantment.
    const equipmentToDamage: ItemStack = this.getEquipment(EquipmentSlot.Mainhand) as ItemStack;
    const player = this.entity as Player;
    if(!player.isSurvival) return false;
    if(!equipmentToDamage.hasComponent(ItemComponentTypes.Durability)) throw "Item doesn't have durability to damage with";
    let level: number = 0;
    const itemDurability: ItemDurabilityComponent = (equipmentToDamage.getComponent(ItemComponentTypes.Durability) as ItemDurabilityComponent);
    if(equipmentToDamage.hasComponent(ItemComponentTypes.Enchantable)) {
      const enchantment = equipmentToDamage.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent;
      if(enchantment.hasEnchantment(MinecraftEnchantmentTypes.Unbreaking)) level = enchantment.getEnchantment(MinecraftEnchantmentTypes.Unbreaking).level;
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