import { FormBuilder } from "utils/form_builder";
import { cloneConfiguration } from "./configuration_handler";
export const serverConfiguration = {
    caughtFishDespawnTimer: new FormBuilder("yn:fishing_got_reel.configuration.server.caught_fish_despawn_timer").createTextField("30"),
    expirationTimer: new FormBuilder("yn:fishing_got_reel.configuration.server.expiration_timer").createTextField("300"),
    CatchingPlacement: new FormBuilder("yn:fishing_got_reel.configuration.server.caught_direction").createDropdown(['CURRENT', 'BACK', 'FRONT'], "CURRENT"),
    caughtFishDespawns: new FormBuilder("yn:fishing_got_reel.configuration.server.does_caught_fish_despawn").createToggle(false),
    ShowMessageUponJoin: new FormBuilder("yn:fishing_got_reel.configuration.server.show_message_on_join").createToggle(true),
    debug: new FormBuilder("Debug Mode").createToggle(true),
};
export let serverConfigurationCopy = cloneConfiguration(serverConfiguration);
export let setServerConfiguration = (newServerConfig) => serverConfigurationCopy = newServerConfig;
export let resetServerConfiguration = () => serverConfigurationCopy = cloneConfiguration(serverConfiguration);
export const VERSION = "1.1.0";
