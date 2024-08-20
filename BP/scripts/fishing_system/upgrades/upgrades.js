import { FishingCustomEnchantmentType } from "custom_enchantment/custom_enchantment_types";
export class HookUpgrades {
    constructor(source) {
        this._source = source;
    }
    has(customUpgrade) {
        return this._source.hasCustomEnchantment(FishingCustomEnchantmentType[customUpgrade]);
    }
}
