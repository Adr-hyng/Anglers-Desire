
import { ItemStack } from "@minecraft/server";
import { OverTakes } from "./partial_overtakes";

declare module "@minecraft/server" {
  interface ItemStack {
    asEntity: string;
  }
}

OverTakes(ItemStack.prototype, {
});