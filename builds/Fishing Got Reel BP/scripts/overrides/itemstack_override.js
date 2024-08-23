import { ItemEnchantableComponent, ItemStack } from "@minecraft/server";
import { OverTakes } from "./partial_overtakes";
OverTakes(ItemStack.prototype, {
    hasLore(loreId) {
        return this.getLore().some(lore => lore.startsWith(loreId));
    },
    get enchantment() {
        return this.getComponent(ItemEnchantableComponent.componentId);
    },
});
