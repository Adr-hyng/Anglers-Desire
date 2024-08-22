import { World } from '@minecraft/server';
import { db } from 'constant';
import { OverTakes } from "overrides/partial_overtakes";
OverTakes(World.prototype, {
    get IsRaining() {
        return db.get("WorldIsRaining");
    }
});
