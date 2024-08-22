import { EnchantmentTypes, EntityComponentTypes, EntityInventoryComponent, EquipmentSlot, ItemComponentTypes, ItemEnchantableComponent, ItemStack, MolangVariableMap, RawMessage, system } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { MinecraftItemTypes, MinecraftEnchantmentTypes } from "vanilla-types/index";
import { ICommandBase} from "./ICommandBase";
import { SendMessageTo} from "utils/utilities";
import { overrideEverything } from "overrides/index";
import { FishingCustomEnchantmentType } from "custom_enchantment/custom_enchantment_types";
import { fetchFisher } from "constant";
import { MinecraftEntityTypes } from "vanilla-types/index";
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
                fishingRod = fetchFisher(player).fishingRod.getEquipment(EquipmentSlot.Mainhand);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Lure), level: 3});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.LuckOfTheSea), level: 3});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Mending), level: 1});

                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment({name: FishingCustomEnchantmentType.Pyroclasm.name, level: 1});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment({name: FishingCustomEnchantmentType.Nautilus.name, level: 2});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment({name: FishingCustomEnchantmentType.LuminousSiren.name, level: 3});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment({name: FishingCustomEnchantmentType.Tempus.name, level: 4});

                (player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container.setItem(player.selectedSlotIndex, fishingRod);
                break;
            case REQUIRED_PARAMETER.TEST:
                fishingRod = new ItemStack("minecraft:fishing_rod", 1);
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Lure), level: 1});
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.LuckOfTheSea), level: 3});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).addEnchantment({type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Mending), level: 1});

                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment({name: FishingCustomEnchantmentType.Pyroclasm.name, level: 1});
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment({name: FishingCustomEnchantmentType.Nautilus.name, level: 1});
                // (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment({name: FishingCustomEnchantmentType.LuminousSiren.name, level: 1});
                (fishingRod.getComponent(ItemComponentTypes.Enchantable) as ItemEnchantableComponent).override(fishingRod).addCustomEnchantment({name: FishingCustomEnchantmentType.Tempus.name, level: 1});

                (player.getComponent(EntityComponentTypes.Inventory) as EntityInventoryComponent).container.addItem(fishingRod);
                break;
            case REQUIRED_PARAMETER.PARTICLE:
                const molang = new MolangVariableMap();
                molang.setFloat("max_lifetime", parseInt(args[1]) ?? 2);
                molang.setFloat("splash_spread", parseInt(args[2]) ?? 5);
                molang.setFloat("splash_radius", parseInt(args[3]) ?? 3);
                player.dimension.spawnParticle("yn:test_splash", {x: player.location.x + 2, y: player.location.y - 2, z: player.location.z + 2}, molang);
                break;
            default:
                break;
        }
    }
};
export default command