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
    "OnSubmergeSE": new FormBuilder("Enable Submerged Sound").createToggle(true),
    "OnTreasureSE": new FormBuilder("Enable Treasure Sound").createToggle(true),
    "Caught": new FormBuilder("Caught Output Option").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "ICON"),
    "Escaped": new FormBuilder("Escaped Output Option").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "ICON"),
};
export function cloneClientConfiguration() {
    let clonedConfig = {};
    for (const [key, _formBuilder] of Object.entries(clientConfiguration)) {
        const formBuilder = _formBuilder;
        const newFormBuilder = new FormBuilder(formBuilder.name);
        if (formBuilder.values) {
            newFormBuilder.createDropdown(formBuilder.values, formBuilder.defaultValue);
        }
        else {
            newFormBuilder.createToggle(formBuilder.defaultValue);
        }
        clonedConfig[key] = newFormBuilder;
    }
    return clonedConfig;
}
