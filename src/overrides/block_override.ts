
import { 
  Block} from '@minecraft/server';
import { OverTakes } from "overrides/partial_overtakes";

declare module "@minecraft/server" {
  interface Block {
    get isSolidStable(): boolean;
  }
}


OverTakes(Block.prototype, {
  get isSolidStable() {
    return !this.isAir && !this.isLiquid;
  }
});