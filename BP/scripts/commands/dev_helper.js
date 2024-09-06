import { BlockTypes, EquipmentSlot, MolangVariableMap, system } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { SendMessageTo, sleep } from "utils/utilities";
import { overrideEverything } from "overrides/index";
import { MinecraftBlockTypes } from "vanilla-types/index";
import { AStarOptions } from "utils/NoxUtils/Pathfinder/AStarOptions";
import { BidirectionalAStar } from "utils/NoxUtils/Pathfinder/BidirectionalAStar";
overrideEverything();
var REQUIRED_PARAMETER;
(function (REQUIRED_PARAMETER) {
    REQUIRED_PARAMETER["GET"] = "get";
    REQUIRED_PARAMETER["TEST"] = "test";
    REQUIRED_PARAMETER["RELOAD"] = "reload";
    REQUIRED_PARAMETER["DAMAGE_USAGE"] = "damage";
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
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.RELOAD} = Reload the fishing rod bug.
        > ${CommandHandler.prefix}${this.name} ${REQUIRED_PARAMETER.DAMAGE_USAGE} = Damages fishing rod hook usage.
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
                fishingRod = player.equippedTool(EquipmentSlot.Mainhand);
                console.warn(JSON.stringify(fishingRod.getDynamicPropertyIds()));
                break;
            case REQUIRED_PARAMETER.DAMAGE_USAGE:
                fishingRod = player.equippedTool(EquipmentSlot.Mainhand);
                fishingRod.enchantment.override(fishingRod).getCustomEnchantments().forEach((c) => {
                    c.init(fishingRod).damageUsage(1);
                });
                player.equippedToolSlot(EquipmentSlot.Mainhand).setItem(fishingRod);
                break;
            case REQUIRED_PARAMETER.RELOAD:
                fishingRod = player.equippedTool(EquipmentSlot.Mainhand);
                const enchantment = fishingRod.enchantment.override(fishingRod);
                for (const customEnchantment of enchantment.getCustomEnchantments()) {
                    const usage = fishingRod.getDynamicProperty(`Fishing${customEnchantment.id}Usage`);
                    const maxUsage = fishingRod.getDynamicProperty(`Fishing${customEnchantment.id}MaxUsage`);
                    if (usage) {
                        fishingRod.setDynamicProperty(`Fishing${customEnchantment.id}Usage`, undefined);
                        fishingRod.setDynamicProperty(`${customEnchantment.dynamicPropID}Usage`, usage);
                    }
                    if (maxUsage) {
                        fishingRod.setDynamicProperty(`Fishing${customEnchantment.id}MaxUsage`, undefined);
                        fishingRod.setDynamicProperty(`${customEnchantment.dynamicPropID}MaxUsage`, maxUsage);
                    }
                }
                player.equippedToolSlot(EquipmentSlot.Mainhand).setItem(fishingRod);
                break;
            case REQUIRED_PARAMETER.TEST:
                system.run(async () => {
                    const options = new AStarOptions(player.location, { x: Math.floor(parseInt(args[1])), y: Math.floor(parseInt(args[2])), z: Math.floor(parseInt(args[3])) }, player.dimension);
                    options.TypeIdsToConsiderPassable = [
                        MinecraftBlockTypes.Air,
                        MinecraftBlockTypes.StructureVoid
                    ];
                    options.AllowYAxisFlood = true;
                    options.MaximumNodesToConsider = 3000;
                    options.DebugMode = false;
                    let aStar;
                    try {
                        aStar = new BidirectionalAStar(options);
                    }
                    catch (e) {
                        console.warn("BROKE", e, e.stack);
                        return false;
                    }
                    const blockPath = await aStar.Pathfind();
                    for (const b of blockPath) {
                        player.dimension.setBlockType(b.location, BlockTypes.get(MinecraftBlockTypes.DiamondBlock));
                        await sleep(10);
                    }
                    await sleep(20);
                    for (const b of blockPath) {
                        player.dimension.setBlockType(b.location, BlockTypes.get(MinecraftBlockTypes.Air));
                        await sleep(2);
                    }
                    console.warn("DONE");
                });
                break;
            case REQUIRED_PARAMETER.PARTICLE:
                const molang = new MolangVariableMap();
                molang.setFloat("max_height", 2.3);
                molang.setFloat("splash_spread", 3);
                molang.setFloat("splash_radius", 2.8);
                molang.setFloat("min_splashes", 60);
                molang.setFloat("max_splashes", 100);
                player.dimension.spawnParticle("yn:water_splash", { x: parseFloat(args[1]), y: parseFloat(args[2]), z: parseFloat(args[3]) }, molang);
                break;
            default:
                break;
        }
    }
};
export default command;
