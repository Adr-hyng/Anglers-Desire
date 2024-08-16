export const ParticleStateOptions = ["TEXT", "ICON", "BOTH", "OFF"] as const;

export class FormBuilder<T extends boolean | typeof ParticleStateOptions[number]> {
  values?: string[];
  defaultValue: T;
  name: string;

  constructor(name: string) {
    this.name = name;
    this.values = [];
  }

  createToggle(defaultValue: boolean): this {
    this.defaultValue = defaultValue as T;
    return this;
  }

  createDropdown(dropDownOptions: string[], defaultValue: typeof ParticleStateOptions[number]): this {
    this.defaultValue = defaultValue as T;
    this.values = dropDownOptions;
    return this;
  }
}

export const clientConfiguration = {
  "OnInitializeMessage": new FormBuilder("Enable Addon Init Message").createToggle(true),
  "OnSubmergeSE": new FormBuilder("Enable Submerged Sound").createToggle(true),
  "OnTreasureSE": new FormBuilder("Enable Treasure Sound").createToggle(true),
  "Caught": new FormBuilder("Caught Output Option").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "ICON"),
  "Escaped": new FormBuilder("Escaped Output Option").createDropdown(["ICON", "TEXT", "BOTH", "OFF"], "ICON"),
}