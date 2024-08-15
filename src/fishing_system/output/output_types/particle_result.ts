import { system, Vector3 } from "@minecraft/server";
import { Fisher } from "fishing_system/entities/fisher";
import { ParticleState } from "types/enums/fishing_particles";
import { Logger } from "utils/logger";
import { generateUUID16 } from "utils/utilities";
import { IFishingOutput } from "../fishing_output_indicator";
import server_configuration from "fishing_system/configuration/server_configuration";

export class ParticleResult implements IFishingOutput {
  public id: string;

  // This Class Instance is only once, so there's no memory leaking or creating of objects happening.
  // But it can create many particles or call many particles or functions.
  // So, it is like a FishingStateOutputHandler
  // Each particle created is stored in the vector max heap, where the max heap is the nearest vector, whenever there's nearest vector 
  // Whenever you create another particle it will check first if its 1 block or more away, if it does then it will not
  // overwrite the particle, if it does it will overwrite or kill it first, then write new particle.
	constructor(private particleState: ParticleState, private fisher: Fisher) { 
    this.id = generateUUID16();
  }
	async reset(): Promise<void> {
    return new Promise((resolve) => {
      system.run(() => {
      try {
          if(!this.fisher.particleSpawner || !this.fisher.particleSpawner?.isValid()) throw new Error("Particle spawned is undefined or not existing");
          const nearestNeighbor = this.fisher.particleVectorLocations.getNearby(this.fisher.particleSpawner.location, this.fisher.particleVectorLocations.distance);
          const nV = this.fisher.source.dimension.getEntities({location: nearestNeighbor, closest: 30, maxDistance: this.fisher.particleVectorLocations.distance, type: "yn:particle_spawner"});
          if(nV.length) nV.forEach((e) => {
            this.fisher.particleVectorLocations.deleteVector(e.location);
            e.triggerEvent("despawn")
          });
          resolve();
        } catch (e) {
          Logger.error(e, e.stack);
          resolve();
        }
      });
    });
	}
	run(newPosition?: Vector3) {
    try {
      if(!this.fisher.source) throw new Error("No player found");
      if(!this.fisher.fishingHook.stablizedLocation && !newPosition) throw new Error("No vector position passed");
      const initialPosition = (this.fisher.fishingHook.stablizedLocation) ? this.fisher.fishingHook.stablizedLocation : newPosition;
      let { x, y, z } = initialPosition;
      if (this.fisher.caughtByHook) {
        const { x: newX, z: newZ } = this.fisher.caughtByHook?.location;
        x = newX;
        z = newZ;
      }
      y = y + 1.5;
      // If the new vector is near from another existing vector in the container, then delete the near particle vector, and 
      // spawn particle to the new particle vector.
      this.reset().then(() => {
        system.run(() => {
          this.fisher.particleSpawner = this.fisher.source.dimension.spawnEntity("yn:particle_spawner", {x, y, z});
          this.fisher.particleSpawner.triggerEvent(this.particleState);
          this.fisher.particleVectorLocations.set({x, y, z});
        });
      });
    } catch (e) {
      Logger.error(e, e.stack);
    }
	}
}