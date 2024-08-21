import { EntityComponentTypes, EquipmentSlot, ItemComponentTypes, ItemStack } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { MinecraftItemTypes } from "vanilla-types/index";
import { SendMessageTo } from "utils/utilities";
import { overrideEverything } from "overrides/index";
import { FishingCustomEnchantmentType } from "custom_enchantment/custom_enchantment_types";
import { fetchFisher } from "constant";
overrideEverything();
var REQUIRED_PARAMETER;
(function (REQUIRED_PARAMETER) {
    REQUIRED_PARAMETER["GET"] = "get";
    REQUIRED_PARAMETER["TEST"] = "test";
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
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment({ name: FishingCustomEnchantmentType.Nautilus.name, level: 2 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment({ name: FishingCustomEnchantmentType.LuminousSiren.name, level: 3 });
                fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod).addCustomEnchantment({ name: FishingCustomEnchantmentType.Tempus.name, level: 4 });
                player.getComponent(EntityComponentTypes.Inventory).container.setItem(player.selectedSlotIndex, fishingRod);
                break;
            case REQUIRED_PARAMETER.TEST:
                fishingRod = new ItemStack(MinecraftItemTypes.FishingRod, 1);
                const enchantable = fishingRod.getComponent(ItemComponentTypes.Enchantable).override(fishingRod);
                enchantable.addCustomEnchantment(FishingCustomEnchantmentType.Pyroclasm);
                enchantable.addCustomEnchantment(FishingCustomEnchantmentType.Nautilus);
                enchantable.addCustomEnchantment(FishingCustomEnchantmentType.LuminousSiren);
                enchantable.addCustomEnchantment(FishingCustomEnchantmentType.Tempus);
                player.getComponent(EntityComponentTypes.Inventory).container.addItem(fishingRod);
                break;
            default:
                break;
        }
    }
};
export default command;
