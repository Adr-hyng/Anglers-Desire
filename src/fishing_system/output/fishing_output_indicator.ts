import { Vector3 } from "@minecraft/server";

export interface IFishingOutput {
  id: string;
  run(newPosition?: Vector3): void;
  reset?(): Promise<void>;
  markExecuted?(): void;
}

export type FishingStateTypes = {
  Finding: IFishingOutput;
  Interest: IFishingOutput;
  Caught: IFishingOutput;
  Escaped: IFishingOutput;
  NotFound: IFishingOutput;
}