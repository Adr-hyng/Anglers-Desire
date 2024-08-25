import { FormBuilder } from "utils/form_builder";
export const clientConfiguration = {
    "Caught": new FormBuilder("Caught Output Option").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "ICON"),
    "Escaped": new FormBuilder("Escaped Output Option").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "ICON"),
    "OnSubmergeSE": new FormBuilder("Enable Submerged Sound").createToggle(true),
    "OnTreasureSE": new FormBuilder("Enable Treasure Sound").createToggle(true),
};
