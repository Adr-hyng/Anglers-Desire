import { system } from "@minecraft/server";
import { Logger } from "utils/logger";
import { generateUUID16 } from "utils/utilities";
export class BothResult {
    constructor(message, particleState, fisher) {
        this.message = message;
        this.particleState = particleState;
        this.fisher = fisher;
        this.executed = false;
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
    run() {
        if (!this.fisher.source)
            return;
        if (!this.executed) {
            var _rawMessage = {
                rawtext: [
                    {
                        text: this.fisher.source.nameTag + ": ",
                    },
                    {
                        translate: this.message,
                    },
                ],
            };
            this.fisher.source.sendMessage(_rawMessage);
            this.markExecuted();
        }
        const initialHookPosition = this.fisher.initialHookPosition;
        let { x, y, z } = initialHookPosition;
        if (this.fisher.fishCaught) {
            const { x: newX, z: newZ } = this.fisher.fishCaught.location;
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
    markExecuted() {
        this.executed = true;
    }
}
