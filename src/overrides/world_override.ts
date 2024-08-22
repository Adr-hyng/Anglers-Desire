
import { 
  World
} from '@minecraft/server';
import { db } from 'constant';
import { OverTakes } from "overrides/partial_overtakes";

declare module "@minecraft/server" {
  interface World {
    get IsRaining(): boolean;
  }
}


OverTakes(World.prototype, {
  get IsRaining() {
    return db.get("WorldIsRaining") as boolean;
  }
});