import { ItemStack } from "@minecraft/server";
import { OverTakes } from "./partial_overtakes";
OverTakes(ItemStack.prototype, {
    hasLore(loreId) {
        return this.getLore().includes(loreId);
    }
});
