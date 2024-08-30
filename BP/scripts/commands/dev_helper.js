import { EnchantmentTypes, EntityComponentTypes, ItemComponentTypes, ItemStack, MolangVariableMap } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { SendMessageTo } from "utils/utilities";
import { overrideEverything } from "overrides/index";
import { MinecraftEnchantmentTypes, MinecraftItemTypes } from "vanilla-types/index";
import { FishingCustomEnchantmentType } from "custom_enchantment/custom_enchantment_types";
import { world } from "@minecraft/server";
import { system } from "@minecraft/server";
import { Vec3 } from "utils/Vector/VectorUtils";
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
                fishingRod = new ItemStack(MinecraftItemTypes.FishingRod, 1);
                fishingRod.getComponent(ItemComponentTypes.Enchantable).addEnchantment({ type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Lure), level: 3 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).addEnchantment({ type: EnchantmentTypes.get(MinecraftEnchantmentTypes.LuckOfTheSea), level: 3 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).addEnchantment({ type: EnchantmentTypes.get(MinecraftEnchantmentTypes.Mending), level: 1 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.FermentedEye);
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Luminous);
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Nautilus);
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Pyroclasm);
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment(FishingCustomEnchantmentType.Tempus);
                player.getComponent(EntityComponentTypes.Inventory).container.setItem(player.selectedSlotIndex, fishingRod);
                break;
            case REQUIRED_PARAMETER.TEST:
                let count = 0;
                const t = system.runInterval(() => {
                    if (count >= 100)
                        system.clearRun(t);
                    count++;
                    world.getDimension(player.dimension.id).getEntities({
                        closest: 1,
                        type: "yn:coelacanth",
                    }).forEach((e) => {
                        player.dimension.spawnParticle("minecraft:villager_happy", new Vec3(e.location).add(e.getViewDirection()));
                        console.warn("Dir: ", e.getViewDirection().y);
                    });
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
