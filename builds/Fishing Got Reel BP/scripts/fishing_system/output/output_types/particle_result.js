import { system } from "@minecraft/server";
import { Logger } from "utils/logger";
import { generateUUID16 } from "utils/utilities";
export class ParticleResult {
    constructor(particleState, fisher) {
        this.particleState = particleState;
        this.fisher = fisher;
        this.id = generateUUID16();
    }
    async reset() {
        return await new Promise((resolve) => {
            system.run(() => {
                try {
                    const nearestNeighbor = this.fisher.particleBuilder.getNearestVector(this.fisher.particleSpawner.location, this.fisher.particleBuilder.distance);
                    const nV = this.fisher.source.dimension.getEntities({ location: nearestNeighbor, closest: 30, maxDistance: this.fisher.particleBuilder.distance, type: "yn:particle_spawner" });
                    if (nV.length)
                        nV.forEach((e) => {
                            this.fisher.particleBuilder.deleteVector(e.location);
                            e.triggerEvent("despawn");
                        });
                    resolve();
                }
                catch (e) {
                    Logger.error(e);
                    resolve();
                }
            });
        });
    }
    run(newPosition) {
        try {
            if (!this.fisher.source)
                throw new Error("No player found");
            if (!this.fisher.initialHookPosition && !newPosition)
                throw new Error("No vector position passed");
            const initialPosition = (this.fisher.initialHookPosition) ? this.fisher.initialHookPosition : newPosition;
            let { x, y, z } = initialPosition;
            if (this.fisher.fishCaught) {
                const { x: newX, z: newZ } = this.fisher.fishCaught?.location;
                x = newX;
                z = newZ;
            }
            y = y + 1.5;
            this.reset().then(() => {
                system.run(() => {
                    this.fisher.particleSpawner = this.fisher.source.dimension.spawnEntity("yn:particle_spawner", { x, y, z });
                    this.fisher.particleSpawner.triggerEvent(this.particleState);
                    this.fisher.particleBuilder.addOrUpdateVector({ x, y, z });
                });
            });
        }
        catch (e) {
            Logger.error(e, e.stack);
        }
    }
}
