import { RawMessage } from "@minecraft/server";
import { Fisher } from "fishing_system/entities/fisher";
import { generateUUID16, SendMessageTo } from "utils/utilities";
import { IFishingOutput } from "../IFishingOutput";

export class TextResult implements IFishingOutput {
  public id: string;

  constructor(private message: string, private fisher: Fisher) { this.id = generateUUID16() }

  reset(): Promise<void> {
    return Promise.resolve();
  }

  run() {
    if (!this.fisher.source) return;
    SendMessageTo(this.fisher.source, {
      rawtext: [
        {
          translate: this.message,
          with: [this.fisher.source.name]
        }
      ]
    });
  }
}