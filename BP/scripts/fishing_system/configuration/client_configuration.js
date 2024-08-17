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
    "OnInitializeMessage": new FormBuilder("Enable Addon Init Message").createToggle(true),
    "OnSubmergeSE": new FormBuilder("Enable Submerged Sound").createToggle(true),
    "OnTreasureSE": new FormBuilder("Enable Treasure Sound").createToggle(true),
    "Caught": new FormBuilder("Caught Output Option").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "TEXT"),
    "Escaped": new FormBuilder("Escaped Output Option").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "TEXT"),
};
