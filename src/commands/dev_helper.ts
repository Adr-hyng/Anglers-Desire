import { EnchantmentTypes, EntityComponentTypes, EntityInventoryComponent, EquipmentSlot, ItemComponentTypes, ItemEnchantableComponent, ItemStack, MolangVariableMap, RawMessage, system } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { MinecraftItemTypes, MinecraftEnchantmentTypes } from "vanilla-types/index";
import { ICommandBase} from "./ICommandBase";
import { SendMessageTo} from "utils/utilities";
import { overrideEverything } from "overrides/index";
import { CustomEnchantmentTypes, FishingCustomEnchantmentType } from "custom_enchantment/custom_enchantment_types";
import { fetchFisher } from "constant";
import { MinecraftEntityTypes } from "vanilla-types/index";
import { CustomEnchantment } from "custom_enchantment/custom_enchantment";
overrideEverything();

// Automate this, the values should be the description.
enum REQUIRED_PARAMETER {
    GET = "get",
    TEST = "test",
    PARTICLE = "particle",
}

const command: ICommandBase = {
    name: 'dev_helper',
    description: 'Developer Utility Command',
    format: `[${Object.values(REQUIRED_PARAMETER).join('|')}]`,
    usage() {
        //? It should be Automatic
        return (`
        Format:
        > ${CommandHandler.prefix}${this.name} ${this.format}
        Usage:
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.GET} = GETS an enchanted fishing rod for development.
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.TEST} = TEST a Working-in-progress features.
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.PARTICLE} = TEST a Working-in-progress particle.
        `).replaceAll("        ", "");
    },
    execute(player, args) {
        if (!(args && args.length)) return;
        const requiredParams: string[] = (`[${Object.values(REQUIRED_PARAMETER).join('|')}]`).slice(1, -1).split('|').map(command => command.trim()); 
        const selectedReqParam: string = args[0].toLowerCase();
        if(!requiredParams.includes(selectedReqParam)) return SendMessageTo(
            player, {
                rawtext: [
                {
                    translate: "yn:fishing_got_reel.on_caught_invalid_command",
                    with: [command.usage()]   
                },
                ]
            }
        );
        let fishingRod: ItemStack;
        switch(selectedReqParam) {
            case REQUIRED_PARAMETER.GET:
                const fisher = fetchFisher(player);
                fishingRod = fisher.fishingRod.getEquipment(EquipmentSlot.Mainhand);
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Lure), level: 3});
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.LuckOfTheSea), level: 3});
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Mending), level: 1});
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.FermentedSpiderEyeHook);
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.LuminousSiren);
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Nautilus);
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Pyroclasm);
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Tempus);
                for(const customEnchantment of fishingRod.enchantment.override(fishingRod).getCustomEnchantments()) {
                    customEnchantment.damageUsage(10);
                    console.warn(customEnchantment.name, customEnchantment.usage);
                }
                fishingRod.clearDynamicProperties();
                (player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container.setItem(player.selectedSlotIndex, fishingRod);
                console.warn(JSON.stringify(fishingRod.getDynamicPropertyIds()), fishingRod.getDynamicPropertyIds()[0]);
                break;
            case REQUIRED_PARAMETER.TEST:
                // fishingRod = fetchFisher(player).fishingRod.getEquipment(EquipmentSlot.Mainhand);
                // for(const customEnchantment of fishingRod.enchantment.override(fishingRod).getCustomEnchantments()) {
                //     if(customEnchantment.damageUsage(1)) {
                //         player.playSound("random.break", {volume: 0.5, pitch: 0.7});
                //     }
                //     console.warn(customEnchantment.name, customEnchantment.usage);
                // }
                // (player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container.setItem(player.selectedSlotIndex, fishingRod);

                // fishingRod = new ItemStack("minecraft:fishing_rod", 1);
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Lure), level: 3});
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.LuckOfTheSea), level: 3});
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Mending), level: 1});

                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Tempus);
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.FermentedSpiderEyeHook);
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.LuminousSiren);
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Pyroclasm);
                // (player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container.addItem(fishingRod);
                break;
            case REQUIRED_PARAMETER.PARTICLE:
                const molang = new MolangVariableMap();
                molang.setFloat("max_height", parseFloat(args[1]) ?? 2);
                molang.setFloat("splash_spread", parseFloat(args[2]) ?? 5);
                molang.setFloat("splash_radius", parseFloat(args[3]) ?? 3);
                molang.setFloat("min_splashes", parseFloat(args[4]) ?? 30);
                molang.setFloat("max_splashes", parseFloat(args[5]) ?? 50);
                molang.setFloat("max_splashes", parseFloat(args[5]) ?? 50);
                
                player.dimension.spawnParticle("yn:water_splash", {x: player.location.x + parseFloat(args[6]), y: player.location.y + parseFloat(args[7]), z: player.location.z + parseFloat(args[8])}, molang);
                break;
            default:
                break;
        }
    }
};
export default command