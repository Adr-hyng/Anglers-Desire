import { RawMessage, system } from "@minecraft/server";
import { Fisher } from "fishing_system/entities/fisher";
import { ParticleState } from "types/enums/fishing_particles";
import { Logger } from "utils/logger";
import { generateUUID16 } from "utils/utilities";
import { IFishingOutput } from "../fishing_output_indicator";

export class BothResult implements IFishingOutput {
  private executed = false;
  public id: string;
  constructor(private message: string, private particleState: ParticleState, private fisher: Fisher) { this.id = generateUUID16() }
  async reset(): Promise<void> {
    return new Promise((resolve) => {
      system.run(() => {
      try {
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

  run() {
    if (!this.fisher.source) return;

    if (!this.executed) {
      var _rawMessage: RawMessage = {
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
    const initialHookPosition = this.fisher.fishingHook.stablizedLocation;
    let { x, y, z } = initialHookPosition;
    if (this.fisher.caughtByHook) {
      const { x: newX, z: newZ } = this.fisher.caughtByHook.location;
      x = newX;
      z = newZ;
    }
    y = y + 1.5;
    this.reset().then(() => {
      system.run(() => {
        this.fisher.particleSpawner = this.fisher.source.dimension.spawnEntity("yn:particle_spawner", {x, y, z});
        this.fisher.particleSpawner.triggerEvent(this.particleState);
        this.fisher.particleVectorLocations.set({x, y, z});
      });
    });
  }
  markExecuted() {
    this.executed = true;
  }
}