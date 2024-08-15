import { ActionResultConstant, ActionResultType } from "types/index";

const ActionResultOptions = ["ICON", "TEXT", "BOTH", "OFF"];
export const ActionResultContent: Record<string, string[] | boolean> = {
  "Finding Event": ActionResultOptions,
  "Interested Event": ActionResultOptions,
  "Escaped Event": ActionResultOptions,
  "Caught Event": ActionResultOptions,
  "No Fish Found Event": ActionResultOptions,
};

export const clientConfiguration: Record<string, ActionResultType> = {
  [ActionResultConstant.Finding]: "ICON",
  [ActionResultConstant.Interested]: "ICON",
  [ActionResultConstant.Caught]: "ICON",
  [ActionResultConstant.Escaped]: "ICON",
  [ActionResultConstant.NotFound]: "ICON",
}