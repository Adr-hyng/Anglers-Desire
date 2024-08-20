
import { ItemStack } from "@minecraft/server";
import { OverTakes } from "./partial_overtakes";

declare module "@minecraft/server" {
  interface ItemStack {
    asEntity: string;
    hasLore(loreId: string): boolean;
  }
}

OverTakes(ItemStack.prototype, {
  hasLore(loreId) {
    return this.getLore().includes(loreId);
  }
});