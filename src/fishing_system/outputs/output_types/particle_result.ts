import { system, Vector3 } from "@minecraft/server";
import { Fisher } from "fishing_system/entities/fisher";
import { Logger } from "utils/logger";
import { generateUUID16 } from "utils/utilities";
import { IFishingOutput } from "../IFishingOutput";

export class ParticleResult implements IFishingOutput {
  public id: string;

  // This Class Instance is only once, so there's no memory leaking or creating of objects happening.
  // But it can create many particles or call many particles or functions.
  // So, it is like a FishingStateOutputHandler
  // Each particle created is stored in the vector max heap, where the max heap is the nearest vector, whenever there's nearest vector 
  // Whenever you create another particle it will check first if its 1 block or more away, if it does then it will not
  // overwrite the particle, if it does it will overwrite or kill it first, then write new particle.
	constructor(private particleState: string, private fisher: Fisher) { 
    this.id = generateUUID16();
  }
	reset(): void {
    if(!this.fisher.particleSpawner || !this.fisher.particleSpawner?.isValid()) return;
    this.fisher.particleSpawner.triggerEvent('despawn');
	}

  // If there's an existing particle spawner, just override the current particle to the new one, if it's not dispawning yet,
  // if it changes the state then extend its life to default
	run(newPosition?: Vector3) {
    try {
      
      if(!this.fisher.source || !this.fisher.source?.isValid()) throw new Error("No player found");

      if(!(this.fisher.fishingHook.stablizedLocation || this.fisher.fishingHook?.isValid()) && !newPosition) throw new Error("No vector position passed");
      const initialPosition = (this.fisher.fishingHook.stablizedLocation) ? this.fisher.fishingHook.stablizedLocation : newPosition;
      let { x, y, z } = initialPosition;
      if (this.fisher.caughtByHook) {
        const { x: newX, z: newZ } = this.fisher.caughtByHook?.location;
        x = newX;
        z = newZ;
      }
      y = y + 1.5;
      system.run(() => {
        if(!this.fisher.particleSpawner?.isValid()) {
          this.fisher.particleSpawner = this.fisher.source.dimension.spawnEntity("yn:particle_spawner", {x, y, z});
        }
        this.fisher.particleSpawner.triggerEvent(this.particleState);
      });
    } catch (e) {
      Logger.error(e, e.stack);
    }
	}
}