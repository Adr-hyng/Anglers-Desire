import { ItemEnchantableComponent } from "@minecraft/server";
import { FishingCustomEnchantmentType } from "custom_enchantment/custom_enchantment_types";
import { overrideEverything } from "overrides/index";
overrideEverything();
export class HookUpgrades {
    constructor(source) {
        this.source = source;
    }
    has(customEnchant) {
        if (!this.source)
            return;
        return this.source.getComponent(ItemEnchantableComponent.componentId)
            .override(this.source).hasCustomEnchantment(FishingCustomEnchantmentType[customEnchant]);
    }
}
