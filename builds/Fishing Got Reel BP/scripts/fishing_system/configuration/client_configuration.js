import { FormBuilder } from "utils/form_builder";
export const clientConfiguration = {
    "Caught": new FormBuilder("yn:fishing_got_reel.configuration.client.caught_output").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "ICON"),
    "Escaped": new FormBuilder("yn:fishing_got_reel.configuration.client.escape_output").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "ICON"),
    "OnSubmergeSE": new FormBuilder("yn:fishing_got_reel.configuration.client.on_submerged_sound_effect").createToggle(true),
    "OnTreasureSE": new FormBuilder("yn:fishing_got_reel.configuration.client.on_deep_submerged_sound_effect").createToggle(true),
};
