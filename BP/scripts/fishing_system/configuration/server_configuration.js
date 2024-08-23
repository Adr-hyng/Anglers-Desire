import { FormBuilder } from "utils/form_builder";
import { cloneConfiguration } from "./configuration_handler";
export const serverConfiguration = {
    debug: new FormBuilder("Debug Mode").createToggle(true),
    expirationTimer: new FormBuilder("Expiration Timer").createTextField("300"),
    ShowMessageUponJoin: new FormBuilder("Show Message On Join").createToggle(true),
    CatchingPlacement: new FormBuilder("Fishing Placement Offset").createDropdown(['BACK', 'CURRENT', 'FRONT'], "BACK"),
};
export let serverConfigurationCopy = cloneConfiguration(serverConfiguration);
export let setServerConfiguration = (newServerConfig) => serverConfigurationCopy = newServerConfig;
export let resetServerConfiguration = () => serverConfigurationCopy = cloneConfiguration(serverConfiguration);
export const VERSION = "1.0.0";
