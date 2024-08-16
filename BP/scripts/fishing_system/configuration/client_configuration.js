import { ActionResultConstant } from "types/index";
const ActionResultOptions = ["ICON", "TEXT", "BOTH", "OFF"];
export const ActionResultContent = {
    "Escaped Event": ActionResultOptions,
    "Caught Event": ActionResultOptions,
};
export const clientConfiguration = {
    [ActionResultConstant.Caught]: "ICON",
    [ActionResultConstant.Escaped]: "ICON",
};
