import { EnchantmentTypes, EntityComponentTypes, EquipmentSlot, ItemComponentTypes, ItemStack, MolangVariableMap } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { MinecraftEnchantmentTypes } from "vanilla-types/index";
import { SendMessageTo } from "utils/utilities";
import { overrideEverything } from "overrides/index";
import { FishingCustomEnchantmentType } from "custom_enchantment/custom_enchantment_types";
import { fetchFisher } from "constant";
overrideEverything();
var REQUIRED_PARAMETER;
(function (REQUIRED_PARAMETER) {
    REQUIRED_PARAMETER["GET"] = "get";
    REQUIRED_PARAMETER["TEST"] = "test";
    REQUIRED_PARAMETER["PARTICLE"] = "particle";
})(REQUIRED_PARAMETER || (REQUIRED_PARAMETER = {}));
const command = {
    name: 'dev_helper',
    description: 'Developer Utility Command',
    format: `[${Object.values(REQUIRED_PARAMETER).join('|')}]`,
    usage() {
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
        if (!(args && args.length))
            return;
        const requiredParams = (`[${Object.values(REQUIRED_PARAMETER).join('|')}]`).slice(1, -1).split('|').map(command => command.trim());
        const selectedReqParam = args[0].toLowerCase();
        if (!requiredParams.includes(selectedReqParam))
            return SendMessageTo(player, {
                rawtext: [
                    {
                        translate: "yn:fishing_got_reel.on_caught_invalid_command",
                        with: [command.usage()]
                    },
                ]
            });
        let fishingRod;
        switch (selectedReqParam) {
            case REQUIRED_PARAMETER.GET:
                fishingRod = fetchFisher(player).fishingRod.getEquipment(EquipmentSlot.Mainhand);
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment({ name: FishingCustomEnchantmentType.Pyroclasm.name, level: 1 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment({ name: FishingCustomEnchantmentType.Nautilus.name, level: 1 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment({ name: FishingCustomEnchantmentType.LuminousSiren.name, level: 1 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment({ name: FishingCustomEnchantmentType.Tempus.name, level: 1 });
                player.getComponent(EntityComponentTypes.Inventory).container.setItem(player.selectedSlotIndex, fishingRod);
                break;
            case REQUIRED_PARAMETER.TEST:
                fishingRod = new ItemStack("minecraft:fishing_rod", 1);
                fishingRod.getComponent(ItemComponentTypes.Enchantable).addEnchantment({ type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Lure), level: 1 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).addEnchantment({ type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Mending), level: 1 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment({ name: FishingCustomEnchantmentType.Tempus.name, level: 1 });
                player.getComponent(EntityComponentTypes.Inventory).container.addItem(fishingRod);
                break;
            case REQUIRED_PARAMETER.PARTICLE:
                const molang = new MolangVariableMap();
                molang.setFloat("max_height", parseFloat(args[1]) ?? 2);
                molang.setFloat("splash_spread", parseFloat(args[2]) ?? 5);
                molang.setFloat("splash_radius", parseFloat(args[3]) ?? 3);
                molang.setFloat("min_splashes", parseFloat(args[4]) ?? 30);
                molang.setFloat("max_splashes", parseFloat(args[5]) ?? 50);
                molang.setFloat("max_splashes", parseFloat(args[5]) ?? 50);
                player.dimension.spawnParticle("yn:water_splash", { x: player.location.x + parseFloat(args[6]), y: player.location.y + parseFloat(args[7]), z: player.location.z + parseFloat(args[8]) }, molang);
                break;
            default:
                break;
        }
    }
};
export default command;
