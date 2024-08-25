import { FormBuilder } from "utils/form_builder";
import { cloneConfiguration } from "./configuration_handler";

export const serverConfiguration = {
  /**
   * Number of seconds before cancelling the fishing system.
   */
  expirationTimer: new FormBuilder("Expiration Timer").createTextField("300"),
  /**
   * The locator for when will be caught entity be placed or reeled
   */
  CatchingPlacement: new FormBuilder("Caught Direction").createDropdown(['CURRENT', 'BACK', 'FRONT'], "CURRENT"),
  /**
   * Shows the script initialization message log upon player joining, default is true.
   */
  ShowMessageUponJoin: new FormBuilder("Show Message On Join ").createToggle(true),
  /**
   * Enables debug messages to content logs.
   */
  debug: new FormBuilder("Debug Mode").createToggle(true),
};

export let serverConfigurationCopy = cloneConfiguration(serverConfiguration);
export let setServerConfiguration = (newServerConfig) => serverConfigurationCopy = newServerConfig;
export let resetServerConfiguration = () => serverConfigurationCopy = cloneConfiguration(serverConfiguration);

// version (do not change)
export const VERSION = "1.0.0";