import { IFishingOutput } from "../IFishingOutput";

export class DisabledResult implements IFishingOutput {
  public id: string;
  run() {}
}