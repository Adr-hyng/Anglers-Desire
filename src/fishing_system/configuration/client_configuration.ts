import { ActionResultConstant, ActionResultType } from "types/index";

const ActionResultOptions = ["ICON", "TEXT", "BOTH", "OFF"];
export const ActionResultContent: Record<string, string[] | boolean> = {
  "Escaped Event": ActionResultOptions,
  "Caught Event": ActionResultOptions,
};

export const clientConfiguration: Record<string, ActionResultType> = {
  [ActionResultConstant.Caught]: "ICON",
  [ActionResultConstant.Escaped]: "ICON",
}