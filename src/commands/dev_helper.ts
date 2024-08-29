import { EnchantmentTypes, EntityComponentTypes, EntityInventoryComponent, EquipmentSlot, ItemComponentTypes, ItemEnchantableComponent, ItemStack, MolangVariableMap } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { ICommandBase} from "./ICommandBase";
import { SendMessageTo} from "utils/utilities";
import { overrideEverything } from "overrides/index";
import { MinecraftEnchantmentTypes, MinecraftItemTypes } from "vanilla-types/index";
import { FishingCustomEnchantmentType } from "custom_enchantment/custom_enchantment_types";
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
                fishingRod = new ItemStack(MinecraftItemTypes.FishingRod, 1);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Lure), level: 3});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.LuckOfTheSea), level: 3});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Mending), level: 1});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.FermentedEye);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Luminous);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Nautilus);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Pyroclasm);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Tempus);
                (player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container.setItem(player.selectedSlotIndex, fishingRod);
                break;
            case REQUIRED_PARAMETER.TEST:
                break;
            case REQUIRED_PARAMETER.PARTICLE:
                const molang = new MolangVariableMap();
                molang.setFloat("max_height", 2.3);
                molang.setFloat("splash_spread", 3);
                molang.setFloat("splash_radius", 2.8);
                molang.setFloat("min_splashes", 60);
                molang.setFloat("max_splashes", 100);
                // molang.setFloat("max_height", parseFloat(args[1]) ?? 2);
                // molang.setFloat("splash_spread", parseFloat(args[2]) ?? 5);
                // molang.setFloat("splash_radius", parseFloat(args[3]) ?? 3);
                // molang.setFloat("min_splashes", parseFloat(args[4]) ?? 30);
                // molang.setFloat("max_splashes", parseFloat(args[5]) ?? 50);
                // molang.setFloat("max_splashes", parseFloat(args[5]) ?? 50);
                player.dimension.spawnParticle("yn:water_splash", {x: parseFloat(args[1]), y: parseFloat(args[2]), z: parseFloat(args[3])}, molang);
                break;
            default:
                break;
        }
    }
};
export default command