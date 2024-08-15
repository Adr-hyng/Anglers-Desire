import { IFishingOutput } from "../fishing_output_indicator";

export class DisabledResult implements IFishingOutput {
  public id: string;
  run() {}
}