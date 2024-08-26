import { system } from "@minecraft/server";
import { Logger } from "utils/logger";
import { generateUUID16 } from "utils/utilities";
export class ParticleResult {
    constructor(particleState, fisher) {
        this.particleState = particleState;
        this.fisher = fisher;
        this.id = generateUUID16();
    }
    reset() {
        if (!this.fisher.particleSpawner || !this.fisher.particleSpawner?.isValid())
            return;
        this.fisher.particleSpawner.triggerEvent('despawn');
    }
    run(newPosition) {
        try {
            if (!this.fisher.source || !this.fisher.source?.isValid())
                throw new Error("No player found");
            if (!(this.fisher.fishingHook.stablizedLocation || this.fisher.fishingHook?.isValid()) && !newPosition)
                throw new Error("No vector position passed");
            const initialPosition = (this.fisher.fishingHook.stablizedLocation) ? this.fisher.fishingHook.stablizedLocation : newPosition;
            let { x, y, z } = initialPosition;
            if (this.fisher.caughtByHook) {
                const { x: newX, z: newZ } = this.fisher.caughtByHook?.location;
                x = newX;
                z = newZ;
            }
            y = y + 1.5;
            system.run(() => {
                if (!this.fisher.particleSpawner?.isValid()) {
                    this.fisher.particleSpawner = this.fisher.source.dimension.spawnEntity("yn:particle_spawner", { x, y, z });
                    console.warn("NEW: ", this.fisher.particleSpawner.id);
                }
                else {
                    console.warn("EXISTING: ", this.fisher.particleSpawner.id);
                }
                this.fisher.particleSpawner.triggerEvent(this.particleState);
            });
        }
        catch (e) {
            Logger.error(e, e.stack);
        }
    }
}
