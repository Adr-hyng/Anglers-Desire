export const ParticleStateOptions = ["TEXT", "ICON", "BOTH", "OFF"];
export class FormBuilder {
    constructor(name) {
        this.name = name;
        this.values = [];
    }
    createToggle(defaultValue) {
        this.defaultValue = defaultValue;
        return this;
    }
    createDropdown(dropDownOptions, defaultValue) {
        this.defaultValue = defaultValue;
        this.values = dropDownOptions;
        return this;
    }
}
export const clientConfiguration = {
    "SoundEffectToggle": new FormBuilder("Enable Sound Effect").createToggle(true),
    "Caught": new FormBuilder("Caught Output Option").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "ICON"),
    "Escaped": new FormBuilder("Escaped Output Option").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "ICON")
};
