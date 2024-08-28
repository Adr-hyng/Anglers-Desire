import { system, Vector3 } from "@minecraft/server";
import { Fisher } from "fishing_system/entities/fisher";
import { Logger } from "utils/logger";
import { generateUUID16, SendMessageTo } from "utils/utilities";
import { IFishingOutput } from "../IFishingOutput";

export class BothResult implements IFishingOutput {
  public id: string;
  constructor(private message: string, private particleState: string, private fisher: Fisher) { this.id = generateUUID16() }
  reset(): void {
    if(!this.fisher.particleSpawner || !this.fisher.particleSpawner?.isValid()) return;
    this.fisher.particleSpawner.triggerEvent('despawn');
	}

  run(newPosition?: Vector3) {
    if (!this.fisher.source) return;
    SendMessageTo(this.fisher.source, {
      rawtext: [
        {
          translate: this.message,
          with: [this.fisher.source.name]
        }
      ]
    });
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
        } else {
          this.fisher.particleSpawner.triggerEvent("despawn");
          this.fisher.particleSpawner = this.fisher.source.dimension.spawnEntity("yn:particle_spawner", {x, y, z});
        }
        this.fisher.particleSpawner.triggerEvent(this.particleState);
      });
    } catch (e) {
      Logger.error(e, e.stack);
    }
  }
}