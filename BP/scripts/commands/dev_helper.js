import { EnchantmentTypes, EntityComponentTypes, ItemComponentTypes, ItemEnchantableComponent, ItemStack, system } from "@minecraft/server";
import { CommandHandler } from "commands/command_handler";
import { MinecraftItemTypes, MinecraftEnchantmentTypes } from "vanilla-types/index";
import { ActionFormData } from "@minecraft/server-ui";
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
                    const item = new ItemStack(MinecraftItemTypes.IronSword);
                    item.getComponent(ItemEnchantableComponent.componentId).addEnchantments([
                        { type: EnchantmentTypes.get("mending"), level: 1 },
                        { type: EnchantmentTypes.get("sharpness"), level: 5 },
                        { type: EnchantmentTypes.get("fire_aspect"), level: 1 },
                    ]);
                    const loreModifier = item.getComponent(ItemEnchantableComponent.componentId).getEnchantments().map((ench) => {
                        return { level: ench.level, type: ench.type };
                    });
                    const form = new ActionFormData();
                    form.title(`test`);
                    form.body(player.name + JSON.stringify(loreModifier));
                    form.button("ok");
                    form.show(player).then(result => {
                        if (result.selection === 0) {
                            giveitem(player, MinecraftItemTypes.IronSword, 1, loreModifier, 10);
                        }
                    });
                });
                break;
            default:
                break;
        }
    }
};
export default command;
function giveitem(player, itemid, amount, loreModifier, durability) {
    const inv = player.getComponent("inventory").container;
    const item = new ItemStack(itemid, amount);
    const durabilityy = item.getComponent("durability");
    durabilityy.damage = durability;
    const enchantable = item.getComponent("enchantable");
    enchantable.addEnchantments(loreModifier);
    inv.addItem(item);
}
