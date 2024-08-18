import { ADDON_NAME } from "constant";
import Configuration from "./server_configuration";
import { Player } from "@minecraft/server";

export let SERVER_CONFIGURATION = {
  ...Configuration
};
const originalServerConfiguration = JSON.parse(JSON.stringify(Configuration));
export const resetServerConfiguration = () => SERVER_CONFIGURATION = originalServerConfiguration;
export const getServerConfiguration = () => SERVER_CONFIGURATION;
export const setServerConfiguration = (newConfig: typeof Configuration) => SERVER_CONFIGURATION = newConfig;

export type ConfigurationTypes = "SERVER" | "CLIENT";
export const ConfigurationCollections_DB = (player: Player, configType: ConfigurationTypes = "CLIENT") => `${ADDON_NAME}|${player.id}|${configType}`;