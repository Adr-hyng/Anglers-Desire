import { FormBuilder } from "utils/form_builder";
import { cloneConfiguration } from "./configuration_handler";
export const serverConfiguration = {
    caughtFishDespawnTimer: new FormBuilder("Caught Fish Despawn Timer").createTextField("30"),
    expirationTimer: new FormBuilder("Expiration Timer").createTextField("300"),
    CatchingPlacement: new FormBuilder("Caught Direction").createDropdown(['CURRENT', 'BACK', 'FRONT'], "CURRENT"),
    caughtFishDespawns: new FormBuilder("Caught Fish Despawns").createToggle(false),
    ShowMessageUponJoin: new FormBuilder("Show Message On Join ").createToggle(true),
    debug: new FormBuilder("Debug Mode").createToggle(true),
};
export let serverConfigurationCopy = cloneConfiguration(serverConfiguration);
export let setServerConfiguration = (newServerConfig) => serverConfigurationCopy = newServerConfig;
export let resetServerConfiguration = () => serverConfigurationCopy = cloneConfiguration(serverConfiguration);
export const VERSION = "1.0.0";
