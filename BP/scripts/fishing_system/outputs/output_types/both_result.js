import { system } from "@minecraft/server";
import { Logger } from "utils/logger";
import { generateUUID16, SendMessageTo } from "utils/utilities";
export class BothResult {
    constructor(message, particleState, fisher) {
        this.message = message;
        this.particleState = particleState;
        this.fisher = fisher;
        this.id = generateUUID16();
    }
    async reset() {
        return new Promise((resolve) => {
            system.run(() => {
                try {
                    const nearestNeighbor = this.fisher.particleVectorLocations.getNearby(this.fisher.particleSpawner.location, this.fisher.particleVectorLocations.distance);
                    const nV = this.fisher.source.dimension.getEntities({ location: nearestNeighbor, closest: 30, maxDistance: this.fisher.particleVectorLocations.distance, type: "yn:particle_spawner" });
                    if (nV.length)
                        nV.forEach((e) => {
                            this.fisher.particleVectorLocations.deleteVector(e.location);
                            e.triggerEvent("despawn");
                        });
                    resolve();
                }
                catch (e) {
                    Logger.error(e, e.stack);
                    resolve();
                }
            });
        });
    }
    run(newPosition) {
        if (!this.fisher.source)
            return;
        SendMessageTo(this.fisher.source, {
            rawtext: [
                {
                    translate: this.message,
                    with: [this.fisher.source.name]
                }
            ]
        });
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
            this.reset().then(() => {
                system.run(() => {
                    this.fisher.particleSpawner = this.fisher.source.dimension.spawnEntity("yn:particle_spawner", { x, y, z });
                    this.fisher.particleSpawner.triggerEvent(this.particleState);
                    this.fisher.particleVectorLocations.set({ x, y, z });
                });
            });
        }
        catch (e) {
            Logger.error(e, e.stack);
        }
    }
}
