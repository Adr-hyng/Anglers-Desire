import { RawMessage } from "@minecraft/server";
import { Fisher } from "fishing_system/entities/fisher";
import { generateUUID16 } from "utils/utilities";
import { IFishingOutput } from "../fishing_output_indicator";

export class TextResult implements IFishingOutput {
  private executed = false;
  public id: string;

  constructor(private message: string, private fisher: Fisher) { this.id = generateUUID16() }

  run() {
    if (this.executed || !this.fisher.source) return;
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
    this.fisher.source.sendMessage(_rawMessage); // I don't know why this errors this: Object did not have a native handle.
    this.markExecuted();
  }
  markExecuted() {
    this.executed = true;
  }
}