import { EnchantmentType } from '@minecraft/server';
import { OverTakes } from "overrides/partial_overtakes";
OverTakes(EnchantmentType.prototype, {
    setProperty(weight, range, conflicts) {
        this.weight = weight;
        this.range = range;
        this.conflicts = conflicts ?? [];
        return this;
    },
});
