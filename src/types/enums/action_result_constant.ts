export type ActionResultType = ("TEXT" | "ICON" | "BOTH" | "OFF") | boolean;

export enum ActionResultConstant {
  Caught = "Caught",
  Finding = "Finding",
  Escaped = "Escaped",
  Interested = "Interested",
  NotFound = "NotFound"
}