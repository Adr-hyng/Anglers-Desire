import { EnchantmentTypes, EntityComponentTypes, ItemComponentTypes, ItemStack, system } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { MinecraftItemTypes } from "vanilla-types/index";
import { MinecraftEnchantmentTypes } from "vanilla-types/mojang-enchantment";
var REQUIRED_PARAMETER;
(function (REQUIRED_PARAMETER) {
    REQUIRED_PARAMETER["GET"] = "get";
    REQUIRED_PARAMETER["TEST"] = "test";
    REQUIRED_PARAMETER["LOOK_PATHFIND"] = "look_pathfind";
    REQUIRED_PARAMETER["CLEAR_PATHFIND"] = "clear_pathfind";
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
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.LOOK_PATHFIND} = TEST Pathfinding by looking.
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.CLEAR_PATHFIND} = Clear Pathfinding paths (structure void).
        `).replaceAll("        ", "");
    },
    execute(player, args) {
        if (!(args && args.length))
            return;
        const requiredParams = (`[${Object.values(REQUIRED_PARAMETER).join('|')}]`).slice(1, -1).split('|').map(command => command.trim());
        const selectedReqParam = args[0].toLowerCase();
        if (!requiredParams.includes(selectedReqParam))
            return player.sendMessage("§cInvalid Usage Format." + command.usage());
        if (!player.StableIsOp())
            return;
        switch (selectedReqParam) {
            case REQUIRED_PARAMETER.GET:
                const fishingRod = new ItemStack(MinecraftItemTypes.FishingRod, 1);
                fishingRod.getComponent(ItemComponentTypes.Enchantable).addEnchantment({ type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Lure), level: 3 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).addEnchantment({ type: EnchantmentTypes.get(MinecraftEnchantmentTypes.LuckOfTheSea), level: 3 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).addEnchantment({ type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Mending), level: 1 });
                player.getComponent(EntityComponentTypes.Inventory).container.addItem(fishingRod);
                break;
            case REQUIRED_PARAMETER.TEST:
                if (!player.StableIsOp())
                    break;
                system.run(() => {
                    player.sendMessage("HELLO WORLD!");
                });
                break;
            default:
                break;
        }
    }
};
export default command;
