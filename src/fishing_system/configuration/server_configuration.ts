import { FormBuilder } from "utils/form_builder";
import { cloneConfiguration } from "./configuration_handler";

export const serverConfiguration = {
  /**
   * (Required: Caught Fish Despawns Toggle) Number of seconds before the fish despawns after being reeled.
   */
  caughtFishDespawnTimer: new FormBuilder("yn:fishing_got_reel.configuration.server.caught_fish_despawn_timer").createTextField("30"),
  /**
   * Number of seconds before cancelling the fishing system.
   */
  expirationTimer: new FormBuilder("yn:fishing_got_reel.configuration.server.expiration_timer").createTextField("300"),
  /**
   * The locator for when will be caught entity be placed or reeled
   */
  CatchingPlacement: new FormBuilder("yn:fishing_got_reel.configuration.server.caught_direction").createDropdown(['CURRENT', 'BACK', 'FRONT'], "CURRENT"),
  /**
   * Makes the caught fish despawn after an x amount of seconds being reeled-in.
   */
  caughtFishDespawns: new FormBuilder("yn:fishing_got_reel.configuration.server.does_caught_fish_despawn").createToggle(false),
  /**
   * Shows the script initialization message log upon player joining, default is true.
   */
  ShowMessageUponJoin: new FormBuilder("yn:fishing_got_reel.configuration.server.show_message_on_join").createToggle(true),
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