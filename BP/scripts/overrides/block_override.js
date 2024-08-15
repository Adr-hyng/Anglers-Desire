import { Block } from '@minecraft/server';
import { OverTakes } from "overrides/partial_overtakes";
OverTakes(Block.prototype, {
    get isSolidStable() {
        return !this.isAir && !this.isLiquid;
    }
});
