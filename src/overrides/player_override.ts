import { GameMode, Player} from "@minecraft/server";
import { __Configuration } from "fishing_system/configuration/configuration_screen";
import { OverTakes } from "overrides/partial_overtakes";

declare module "@minecraft/server" {
  interface Player {
    Configuration: __Configuration;
    isSurvival(): boolean;
  }
}

const screenConfigs = new WeakMap<Player, __Configuration>();

OverTakes(Player.prototype, {
  isSurvival(): boolean {
    return this.getGameMode() === GameMode.survival;
  },
  get Configuration() {
    let sc = screenConfigs.get(this);
    if(!sc) screenConfigs.set(this, sc = new __Configuration(this));
    return sc;
  }
});